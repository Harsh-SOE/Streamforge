import { Admin } from 'kafkajs';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';

import { KafkaClient } from '@app/clients/kafka';

@Injectable()
export class AppHealthService implements OnModuleInit, OnModuleDestroy {
  private admin: Admin;

  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly kafka: KafkaClient,
  ) {
    this.admin = this.kafka.getAdmin();
  }

  async onModuleInit() {
    await this.admin.connect();
  }

  async onModuleDestroy() {
    await this.admin.disconnect();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicator.check(key);
    try {
      const topics = await this.admin.listTopics();
      return indicator.up({ health: 'OK', topics: topics });
    } catch (error) {
      console.error(error);
      return indicator.down({ health: 'UNHEALTHY', topics: [] });
    }
  }
}
