import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoundStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CreateGameDto } from './dto/create-game.dto';
import { GamesService } from './games.service';

@ApiTags('Games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all game rooms' })
  @ApiQuery({ name: 'status', enum: RoundStatus, required: false })
  findAll(@Query('status') status?: RoundStatus) {
    return this.gamesService.findAll(status);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get game room details' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new game room' })
  create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Close a game room' })
  close(@Param('id') id: string) {
    return this.gamesService.close(id);
  }
}
