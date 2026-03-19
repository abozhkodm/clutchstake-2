import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Pool, TransactionStatus, TransactionType } from '@prisma/client';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QUEUE_PRIZE_DISTRIBUTION } from '../common/queues';

interface StakeData {
  id: string;
  userId: string;
  pool: Pool;
  amount: number;
}

interface DistributionResult {
  winnerPool: 'A' | 'B' | 'C' | 'TIE';
  winnersShare: number;
  platformShare: number;
  refundPool: 'A' | 'B' | 'C' | null;
}

interface PrizeJobData {
  roundId: string;
  winnerPool: Pool | null;
  distribution: DistributionResult;
  poolTotals: { A: number; B: number; C: number };
  stakes: StakeData[];
}

@Processor(QUEUE_PRIZE_DISTRIBUTION)
export class PrizeDistributionProcessor extends WorkerHost {
  private readonly logger = new Logger(PrizeDistributionProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super();
  }

  async process(job: Job<PrizeJobData>): Promise<void> {
    const { roundId, winnerPool, distribution, stakes } = job.data;
    this.logger.log(`Distributing prizes for round ${roundId}`);

    if (distribution.winnerPool === 'TIE') {
      await this.handleTie(roundId, stakes, distribution);
    } else {
      await this.handleWin(roundId, winnerPool as Pool, stakes, distribution);
    }

    await this.redis.deleteRoundState(roundId);
    this.logger.log(`Prizes distributed for round ${roundId}`);
  }

  private async handleWin(
    roundId: string,
    winnerPool: Pool,
    stakes: StakeData[],
    distribution: DistributionResult,
  ) {
    const winnerStakes = stakes.filter((s) => s.pool === winnerPool);
    const winnerTotalStaked = winnerStakes.reduce((sum, s) => sum + s.amount, 0);

    const ops = winnerStakes.map((stake) => {
      const share = winnerTotalStaked > 0 ? stake.amount / winnerTotalStaked : 0;
      const prize = distribution.winnersShare * share;

      return this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: stake.userId },
          data: { balance: { increment: prize } },
        }),
        this.prisma.transaction.create({
          data: {
            userId: stake.userId,
            type: TransactionType.PRIZE,
            amount: prize,
            status: TransactionStatus.COMPLETED,
            meta: { roundId, pool: stake.pool, winnerPool },
          },
        }),
      ]);
    });

    await Promise.all(ops);
  }

  private async handleTie(roundId: string, stakes: StakeData[], distribution: DistributionResult) {
    // Determine the largest pool (goes to platform)
    // The two equal (smallest) pools get refunded
    const poolCounts: Record<string, number> = { A: 0, B: 0, C: 0 };
    for (const s of stakes) poolCounts[s.pool] = (poolCounts[s.pool] ?? 0) + 1;

    const sorted = (Object.entries(poolCounts) as [string, number][]).sort((a, b) => a[1] - b[1]);
    const platformPool = sorted[2]?.[0] as Pool; // largest pool

    const refundStakes = stakes.filter((s) => s.pool !== platformPool);

    const ops = refundStakes.map((stake) =>
      this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: stake.userId },
          data: { balance: { increment: stake.amount } },
        }),
        this.prisma.transaction.create({
          data: {
            userId: stake.userId,
            type: TransactionType.REFUND,
            amount: stake.amount,
            status: TransactionStatus.COMPLETED,
            meta: { roundId, reason: 'tie' },
          },
        }),
      ]),
    );

    await Promise.all(ops);
  }
}
