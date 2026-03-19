import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findBySteamId(steamId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { steamId } });
  }

  createOrUpdate(data: { steamId: string; username: string; avatar?: string }): Promise<User> {
    return this.prisma.user.upsert({
      where: { steamId: data.steamId },
      update: { username: data.username, avatar: data.avatar },
      create: { steamId: data.steamId, username: data.username, avatar: data.avatar },
    });
  }
}
