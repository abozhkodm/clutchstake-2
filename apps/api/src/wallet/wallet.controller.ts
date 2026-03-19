import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DepositDto } from './dto/deposit.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get current balance' })
  async getBalance(@CurrentUser() user: User) {
    const balance = await this.walletService.getBalance(user.id);
    return { balance };
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Deposit tokens (manual/test)' })
  deposit(@CurrentUser() user: User, @Body() dto: DepositDto) {
    return this.walletService.deposit(user.id, dto.amount);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  getTransactions(@CurrentUser() user: User, @Query('limit') limit?: string) {
    return this.walletService.getTransactions(user.id, limit ? Number(limit) : 50);
  }
}
