import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Pool, RoundStatus, TransactionStatus, TransactionType } from '@prisma/client';
import { calculateSwitchFee } from '@repo/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { DURATION_MINUTES } from '../common/queues';
import { PlaceBetDto } from './dto/place-bet.dto';
import { SwitchPoolDto } from './dto/switch-pool.dto';

@Injectable()
export class BettingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async placeBet(userId: string, dto: PlaceBetDto) {
    const round = await this.prisma.round.findUnique({
      where: { id: dto.roundId },
      include: { gameRoom: true },
    });
    if (!round) throw new NotFoundException(`Round ${dto.roundId} not found`);
    if (round.status !== RoundStatus.ACTIVE) {
      throw new BadRequestException('Round is not active');
    }

    const existingStake = await this.prisma.stake.findUnique({
      where: { userId_roundId: { userId, roundId: dto.roundId } },
    });
    if (existingStake) throw new BadRequestException('You already have a stake in this round');

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (Number(user.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const [stake] = await this.prisma.$transaction([
      this.prisma.stake.create({
        data: {
          userId,
          roundId: dto.roundId,
          pool: dto.pool,
          originalPool: dto.pool,
          amount: dto.amount,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: dto.amount } },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.STAKE,
          amount: dto.amount,
          status: TransactionStatus.COMPLETED,
          meta: { roundId: dto.roundId, pool: dto.pool },
        },
      }),
    ]);

    await this.redis.addBetToPool(dto.roundId, dto.pool as 'A' | 'B' | 'C', dto.amount);

    return stake;
  }

  async switchPool(userId: string, dto: SwitchPoolDto) {
    const stake = await this.prisma.stake.findUnique({
      where: { id: dto.stakeId },
      include: { round: { include: { gameRoom: true } } },
    });
    if (!stake) throw new NotFoundException('Stake not found');
    if (stake.userId !== userId) throw new BadRequestException('Not your stake');
    if (stake.round.status !== RoundStatus.ACTIVE) {
      throw new BadRequestException('Round is not active');
    }
    if (stake.pool === dto.targetPool) {
      throw new BadRequestException('Already in this pool');
    }

    const startedAt = stake.round.startedAt ?? new Date();
    const minutesElapsed = Math.floor((Date.now() - startedAt.getTime()) / 60_000);
    const durationMinutes = DURATION_MINUTES[stake.round.gameRoom.duration] ?? 5;
    const fee = calculateSwitchFee(Number(stake.amount), minutesElapsed, durationMinutes);

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (Number(user.balance) < fee) {
      throw new BadRequestException(`Insufficient balance to pay switch fee of ${fee}`);
    }

    const [updatedStake] = await this.prisma.$transaction([
      this.prisma.stake.update({
        where: { id: dto.stakeId },
        data: {
          pool: dto.targetPool,
          switchFee: { increment: fee },
          switchCount: { increment: 1 },
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: fee } },
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.FEE,
          amount: fee,
          status: TransactionStatus.COMPLETED,
          meta: { stakeId: dto.stakeId, fromPool: stake.pool, toPool: dto.targetPool, minutesElapsed },
        },
      }),
    ]);

    await this.redis.switchBetPool(
      stake.roundId,
      stake.pool as 'A' | 'B' | 'C',
      dto.targetPool as 'A' | 'B' | 'C',
      Number(stake.amount),
    );

    return { stake: updatedStake, fee };
  }

  async getMyStake(userId: string, roundId: string) {
    return this.prisma.stake.findUnique({
      where: { userId_roundId: { userId, roundId } },
    });
  }

  async getFeePreview(userId: string, stakeId: string, targetPool: Pool) {
    const stake = await this.prisma.stake.findUnique({
      where: { id: stakeId },
      include: { round: { include: { gameRoom: true } } },
    });
    if (!stake) throw new NotFoundException('Stake not found');
    if (stake.userId !== userId) throw new BadRequestException('Not your stake');

    const startedAt = stake.round.startedAt ?? new Date();
    const minutesElapsed = Math.floor((Date.now() - startedAt.getTime()) / 60_000);
    const durationMinutes = DURATION_MINUTES[stake.round.gameRoom.duration] ?? 5;
    const minutesRemaining = durationMinutes - minutesElapsed;
    const fee = calculateSwitchFee(Number(stake.amount), minutesElapsed, durationMinutes);

    return {
      stakeId,
      currentPool: stake.pool,
      targetPool,
      originalStake: Number(stake.amount),
      feeAmount: fee,
      minutesElapsed,
      isFinalTwoMinutes: minutesRemaining <= 2,
    };
  }
}
