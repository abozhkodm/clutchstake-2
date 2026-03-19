import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BetType, GameDuration } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsPositive, Max, ValidateIf } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ enum: GameDuration, example: GameDuration.FIVE })
  @IsEnum(GameDuration)
  duration!: GameDuration;

  @ApiProperty({ enum: BetType, example: BetType.ONE_USDT })
  @IsEnum(BetType)
  betType!: BetType;

  @ApiPropertyOptional({ example: 2.5, description: 'Required when betType is CUSTOM' })
  @ValidateIf((o: CreateGameDto) => o.betType === BetType.CUSTOM)
  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  @Max(5_000)
  customBetAmount?: number;
}
