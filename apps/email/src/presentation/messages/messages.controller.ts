import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { USERS_EVENTS } from '@app/common/events';
import { CreatedUserMessageDto } from '@app/contracts/email';
import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';

import { KafkaService } from './messages.service';

@Controller()
export class KafkaController {
  constructor(
    private readonly emailService: KafkaService,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
  ) {}

  @EventPattern(USERS_EVENTS.USER_ONBOARDED_EVENT)
  sendEMail(@Payload() message: CreatedUserMessageDto) {
    return this.emailService.sendEMail(message);
  }
}
