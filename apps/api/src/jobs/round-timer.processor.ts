import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Pool, RoundStatus, TransactionStatus, TransactionType } from '@prisma/client';
import { Job, Queue } from 'bullmq';
import { calculatePrizeDistribution } from '@repo/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QUEUE_PRIZE_DISTRIBUTION, QUEUE_ROUND_TIMER } from '../common/queues';

interface EndRoundJobData {
  roundId: string;
}

@Processor(QUEUE_ROUND_TIMER)
export class RoundTimerProcessor extends WorkerHost {
  private readonly logger = new Logger(RoundTimerProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    @InjectQueue(QUEUE_PRIZE_DISTRIBUTION) private readonly prizeQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<EndRoundJobData>): Promise<void> {
    const { roundId } = job.data;
    this.logger.log(`Ending round ${roundId}`);

    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: { stakes: true, gameRoom: true },
    });

    if (!round || round.status === RoundStatus.FINISHED) {
      this.logger.warn(`Round ${roundId} already finished or not found`);
      return;
    }

    const poolCounts: Record<string, number> = { A: 0, B: 0, C: 0 };
    const poolTotals: Record<string, number> = { A: 0, B: 0, C: 0 };

    for (const stake of round.stakes) {
      poolCounts[stake.pool] = (poolCounts[stake.pool] ?? 0) + 1;
      poolTotals[stake.pool] = (poolTotals[stake.pool] ?? 0) + Number(stake.amount);
    }

    const distribution = calculatePrizeDistribution({
      poolA: { playerCount: poolCounts['A'] ?? 0, totalStaked: poolTotals['A'] ?? 0 },
      poolB: { playerCount: poolCounts['B'] ?? 0, totalStaked: poolTotals['B'] ?? 0 },
      poolC: { playerCount: poolCounts['C'] ?? 0, totalStaked: poolTotals['C'] ?? 0 },
    });

    const winnerPool = distribution.winnerPool === 'TIE' ? null : (distribution.winnerPool as Pool);

    await this.prisma.round.update({
      where: { id: roundId },
      data: { status: RoundStatus.FINISHED, endedAt: new Date(), winnerPool },
    });

    await this.prizeQueue.add('distribute', {
      roundId,
      winnerPool,
      distribution,
      poolTotals,
      stakes: round.stakes.map((stake) => ({
        id: stake.id,
        userId: stake.userId,
        pool: stake.pool,
        amount: Number(stake.amount),
      })),
    });

    this.logger.log(`Round ${roundId} ended. Winner: ${winnerPool ?? 'TIE'}`);
  }
}
