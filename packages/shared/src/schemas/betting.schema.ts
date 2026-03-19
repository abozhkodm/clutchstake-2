import { z } from 'zod';
import { Pool } from '../enums';

export const PlaceBetSchema = z.object({
  roundId: z.string().uuid(),
  pool: z.nativeEnum(Pool),
  amount: z.number().positive(),
});

export type PlaceBet = z.infer<typeof PlaceBetSchema>;

export const SwitchPoolSchema = z.object({
  stakeId: z.string().uuid(),
  targetPool: z.nativeEnum(Pool),
});

export type SwitchPool = z.infer<typeof SwitchPoolSchema>;

export const SwitchFeePreviewSchema = z.object({
  stakeId: z.string().uuid(),
  currentPool: z.nativeEnum(Pool),
  targetPool: z.nativeEnum(Pool),
  originalStake: z.number().positive(),
  feeAmount: z.number().nonnegative(),
  minutesElapsed: z.number().int().nonnegative(),
  isFinalTwoMinutes: z.boolean(),
});

export type SwitchFeePreview = z.infer<typeof SwitchFeePreviewSchema>;
