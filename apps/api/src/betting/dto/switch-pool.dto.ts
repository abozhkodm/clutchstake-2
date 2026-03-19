import { ApiProperty } from '@nestjs/swagger';
import { Pool } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class SwitchPoolDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID(4)
  stakeId!: string;

  @ApiProperty({ enum: Pool, example: Pool.B })
  @IsEnum(Pool)
  targetPool!: Pool;
}
