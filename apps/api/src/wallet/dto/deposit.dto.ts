import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 10, description: 'Amount in USDT to deposit' })
  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  @Max(10_000)
  amount!: number;
}
