import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { RoundsService } from './rounds.service';

@ApiTags('Rounds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post(':gameRoomId/start')
  @ApiOperation({ summary: 'Start a new round in a game room' })
  startRound(@Param('gameRoomId') gameRoomId: string) {
    return this.roundsService.startRound(gameRoomId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get round details' })
  findById(@Param('id') id: string) {
    return this.roundsService.findById(id);
  }

  @Get(':id/state')
  @Public()
  @ApiOperation({ summary: 'Get live round state from cache' })
  getState(@Param('id') id: string) {
    return this.roundsService.getState(id);
  }
}
