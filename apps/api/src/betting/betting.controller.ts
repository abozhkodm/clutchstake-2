import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pool, User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BettingService } from './betting.service';
import { PlaceBetDto } from './dto/place-bet.dto';
import { SwitchPoolDto } from './dto/switch-pool.dto';

@ApiTags('Betting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('betting')
export class BettingController {
  constructor(private readonly bettingService: BettingService) {}

  @Post('stake')
  @ApiOperation({ summary: 'Place a bet on a pool' })
  placeBet(@CurrentUser() user: User, @Body() dto: PlaceBetDto) {
    return this.bettingService.placeBet(user.id, dto);
  }

  @Post('switch')
  @ApiOperation({ summary: 'Switch your bet to another pool' })
  switchPool(@CurrentUser() user: User, @Body() dto: SwitchPoolDto) {
    return this.bettingService.switchPool(user.id, dto);
  }

  @Get('stake/:roundId')
  @ApiOperation({ summary: "Get your stake in a round" })
  getMyStake(@CurrentUser() user: User, @Param('roundId') roundId: string) {
    return this.bettingService.getMyStake(user.id, roundId);
  }

  @Get('fee-preview')
  @ApiOperation({ summary: 'Preview switch fee before switching' })
  getFeePreview(
    @CurrentUser() user: User,
    @Query('stakeId') stakeId: string,
    @Query('targetPool') targetPool: Pool,
  ) {
    return this.bettingService.getFeePreview(user.id, stakeId, targetPool);
  }
}
