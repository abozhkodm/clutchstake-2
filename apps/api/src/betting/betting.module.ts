import { Module } from '@nestjs/common';
import { BettingController } from './betting.controller';
import { BettingService } from './betting.service';

@Module({
  providers: [BettingService],
  controllers: [BettingController],
  exports: [BettingService],
})
export class BettingModule {}
