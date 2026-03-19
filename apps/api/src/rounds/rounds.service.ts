import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma, RoundStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { DURATION_MINUTES, QUEUE_ROUND_TIMER } from '../common/queues';

@Injectable()
export class RoundsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    @InjectQueue(QUEUE_ROUND_TIMER) private readonly roundTimerQueue: Queue,
  ) {}

  async findById(id: string) {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: { gameRoom: true },
    });
    if (!round) throw new NotFoundException(`Round ${id} not found`);
    return round;
  }

  async getState(roundId: string) {
    const round = await this.findById(roundId);
    const cache = await this.redis.getRoundState(roundId);
    return { round, cache };
  }

  async startRound(gameRoomId: string) {
    const gameRoom = await this.prisma.gameRoom.findUnique({
      where: { id: gameRoomId },
      include: { rounds: { where: { status: RoundStatus.ACTIVE }, take: 1 } },
    });
    if (!gameRoom) throw new NotFoundException(`Game room ${gameRoomId} not found`);
    if (gameRoom.rounds.length > 0) {
      throw new BadRequestException('Game room already has an active round');
    }

    const durationMinutes = DURATION_MINUTES[gameRoom.duration] ?? 5;

    const round = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newRound = await tx.round.create({
        data: {
          gameRoomId,
          status: RoundStatus.ACTIVE,
          startedAt: new Date(),
        },
      });

      await tx.gameRoom.update({
        where: { id: gameRoomId },
        data: { status: RoundStatus.ACTIVE },
      });

      return newRound;
    });

    await this.roundTimerQueue.add(
      'end-round',
      { roundId: round.id },
      { delay: durationMinutes * 60 * 1000, jobId: `end-round:${round.id}` },
    );

    return round;
  }

  async finishRound(roundId: string) {
    const round = await this.prisma.round.findUnique({ where: { id: roundId } });
    if (!round) throw new NotFoundException(`Round ${roundId} not found`);
    if (round.status === RoundStatus.FINISHED) return round;

    return this.prisma.round.update({
      where: { id: roundId },
      data: { status: RoundStatus.FINISHED, endedAt: new Date() },
    });
  }
}
