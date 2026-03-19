import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BetType, GameDuration, RoundStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: RoundStatus) {
    return this.prisma.gameRoom.findMany({
      where: status ? { status } : undefined,
      include: { rounds: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const game = await this.prisma.gameRoom.findUnique({
      where: { id },
      include: {
        rounds: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { stakes: { include: { user: { select: { id: true, username: true, avatar: true } } } } },
        },
      },
    });
    if (!game) throw new NotFoundException(`Game room ${id} not found`);
    return game;
  }

  create(dto: CreateGameDto) {
    if (dto.betType === BetType.CUSTOM && !dto.customBetAmount) {
      throw new BadRequestException('customBetAmount is required when betType is CUSTOM');
    }

    return this.prisma.gameRoom.create({
      data: {
        duration: dto.duration,
        betType: dto.betType,
        customBetAmount: dto.customBetAmount ?? null,
      },
    });
  }

  async close(id: string) {
    const game = await this.prisma.gameRoom.findUnique({ where: { id } });
    if (!game) throw new NotFoundException(`Game room ${id} not found`);
    if (game.status === RoundStatus.FINISHED) {
      throw new BadRequestException('Game room is already closed');
    }

    return this.prisma.gameRoom.update({
      where: { id },
      data: { status: RoundStatus.FINISHED },
    });
  }

  getBetAmountForRoom(duration: GameDuration): number {
    const map: Record<GameDuration, number> = {
      [GameDuration.FIVE]: 5,
      [GameDuration.TEN]: 10,
      [GameDuration.FIFTEEN]: 15,
    };
    return map[duration] ?? 1;
  }
}
