import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_PRIZE_DISTRIBUTION, QUEUE_ROUND_TIMER } from '../common/queues';
import { PrizeDistributionProcessor } from './prize-distribution.processor';
import { RoundTimerProcessor } from './round-timer.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE_ROUND_TIMER }),
    BullModule.registerQueue({ name: QUEUE_PRIZE_DISTRIBUTION }),
  ],
  providers: [RoundTimerProcessor, PrizeDistributionProcessor],
})
export class JobsModule {}
