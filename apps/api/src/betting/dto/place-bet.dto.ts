import { ApiProperty } from '@nestjs/swagger';
import { Pool } from '@prisma/client';
import { IsEnum, IsNumber, IsPositive, IsUUID, Max, Min } from 'class-validator';

export class PlaceBetDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID(4)
  roundId!: string;

  @ApiProperty({ enum: Pool, example: Pool.A })
  @IsEnum(Pool)
  pool!: Pool;

  @ApiProperty({ example: 1, description: 'Amount in USDT' })
  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  @Min(0.1)
  @Max(5_000)
  amount!: number;
}
