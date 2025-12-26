import {
  circuitBreaker,
  CircuitBreakerPolicy,
  CircuitState,
  ConsecutiveBreaker,
  ExponentialBackoff,
  handleWhen,
  IPolicy,
  retry,
  RetryPolicy,
  wrap,
} from 'cockatiel';
import { Inject, Injectable } from '@nestjs/common';
import { KafkaJSConnectionError, KafkaJSRequestTimeoutError } from 'kafkajs';

import { Components } from '@app/common/components';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import {
  MessageBusConnectionException,
  MessageBusTimeoutException,
  MessageBusUnknownException,
} from '@app/exceptions/message-bus-exceptions';

import { KafkaMessageBusOperationsOptions } from './types';

export interface kafkaResillienceConfig {
  maxRetries?: number;
  circuitBreakerThreshold?: number;
  halfOpenAfterMs?: number;
}

export interface KafkaHandlerConfig {
  host: string;
  port: number;
  service: string;
  logErrors?: boolean;
  resilienceOptions?: kafkaResillienceConfig;
}

export const KAFKA_CONFIG = Symbol('KAFKA_CONFIG');

@Injectable()
export class KafkaHandler {
  private readonly defaultMaxRetries = 3;
  private readonly defaultHalfOpenAfterMs = 10_000;
  private readonly defaultCircuitBreakerThreshold = 10;
  private readonly errorsToHandle = handleWhen(
    (error) =>
      error instanceof KafkaJSConnectionError || error instanceof KafkaJSRequestTimeoutError,
  );

  private retryPolicy: RetryPolicy;
  private circuitBreakerPolicy: CircuitBreakerPolicy;
  private policy: IPolicy;

  public constructor(
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    @Inject(KAFKA_CONFIG) private readonly config: KafkaHandlerConfig,
  ) {
    this.retryConfig();
    this.circuitConfig();
    this.policy = wrap(this.retryPolicy, this.circuitBreakerPolicy);
  }

  private logErrors(message: string, info: Record<string, any>) {
    if (!this.config.logErrors) {
      return;
    }
    this.logger.error(message, { ...info });
  }

  public retryConfig() {
    this.retryPolicy = retry(this.errorsToHandle, {
      maxAttempts: this.config.resilienceOptions?.maxRetries ?? this.defaultMaxRetries,
      backoff: new ExponentialBackoff(),
    });

    this.retryPolicy.onRetry(({ attempt, delay }) => {
      this.logger.alert(
        `Kafka operation has failed. Attempt number: ${attempt}. ${attempt ? `Retrying in ${delay}ms` : `All Attempts exhausted, Operation has failed!`}`,
        {
          component: Components.MESSAGE_BROKER,
          service: this.config.service,
        },
      );
    });

    this.retryPolicy.onSuccess(({ duration }) =>
      this.logger.info(`Database operation completed successfully in ${duration}ms`, {
        component: Components.MESSAGE_BROKER,
        service: this.config.service,
      }),
    );
  }

  public circuitConfig() {
    this.circuitBreakerPolicy = circuitBreaker(this.errorsToHandle, {
      halfOpenAfter: this.config.resilienceOptions?.halfOpenAfterMs ?? this.defaultHalfOpenAfterMs,
      breaker: new ConsecutiveBreaker(
        this.config.resilienceOptions?.circuitBreakerThreshold ??
          this.defaultCircuitBreakerThreshold,
      ),
    });

    this.circuitBreakerPolicy.onBreak(() =>
      this.logger.alert('Too many requests failed, circuit is now broken', {
        circuitState: CircuitState.Open,
        component: Components.MESSAGE_BROKER,
        service: this.config.service,
      }),
    );

    this.circuitBreakerPolicy.onHalfOpen(() =>
      this.logger.alert('Cicuit will now allow only half of the requests to pass through.', {
        circuitState: CircuitState.HalfOpen,
        component: Components.MESSAGE_BROKER,
        service: this.config.service,
      }),
    );

    this.circuitBreakerPolicy.onReset(() =>
      this.logger.info('Circuit breaker is now reset!', {
        component: Components.MESSAGE_BROKER,
        circuitState: CircuitState.Isolated,
        service: this.config.service,
      }),
    );
  }

  public async execute<TExecutionResult>(
    operation: () => TExecutionResult | Promise<TExecutionResult>,
    options: KafkaMessageBusOperationsOptions,
  ): Promise<TExecutionResult> {
    const { topic, message } = options;
    try {
      return await this.policy.execute(() => operation());
    } catch (error) {
      switch (true) {
        case error instanceof KafkaJSConnectionError: {
          this.logErrors(`Unable to connect to message broker`, error);

          throw new MessageBusConnectionException({
            message: `Unable to connect to kafka broker: ${error.broker}`,
            contextError: error,
            meta: {
              host: this.config.host,
              port: this.config.port,
            },
          });
        }

        case error instanceof KafkaJSRequestTimeoutError:
          this.logErrors(`Message broker request timed out`, error);

          throw new MessageBusTimeoutException({
            message: `Request timed out for kafka broker: ${error.broker}`,
            contextError: error,
            meta: {
              host: this.config.host,
              port: this.config.port,
              topic,
              message,
            },
          });

        default:
          this.logErrors(`Unknown message broker error occured`, error as Error);
          throw new MessageBusUnknownException({
            message: `An Unknown error occured while executing kafka operation`,
            contextError: error as Error,
            meta: {
              host: this.config.host,
              port: this.config.port,
              topic,
              message,
            },
          });
      }
    }
  }
}
