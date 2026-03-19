import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, TransactionStatus, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string): Promise<Decimal> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return user.balance;
  }

  async deposit(userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      return tx.transaction.create({
        data: {
          userId,
          type: TransactionType.DEPOSIT,
          amount,
          status: TransactionStatus.COMPLETED,
        },
      });
    });
  }

  async getTransactions(userId: string, limit = 50) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
