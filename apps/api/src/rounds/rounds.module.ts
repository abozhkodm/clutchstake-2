import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_ROUND_TIMER } from '../common/queues';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';

@Module({
  imports: [BullModule.registerQueue({ name: QUEUE_ROUND_TIMER })],
  providers: [RoundsService],
  controllers: [RoundsController],
  exports: [RoundsService],
})
export class RoundsModule {}
