import { z } from 'zod';
import { BetType, GameDuration, Pool, RoundStatus } from '../enums';

export const GameRoomSchema = z.object({
  id: z.string().uuid(),
  duration: z.nativeEnum(GameDuration),
  betType: z.nativeEnum(BetType),
  customBetAmount: z.number().positive().nullable(),
  status: z.nativeEnum(RoundStatus),
  createdAt: z.coerce.date(),
});

export type GameRoom = z.infer<typeof GameRoomSchema>;

export const CreateGameRoomSchema = GameRoomSchema.pick({
  duration: true,
  betType: true,
  customBetAmount: true,
});

export type CreateGameRoom = z.infer<typeof CreateGameRoomSchema>;

export const RoundSchema = z.object({
  id: z.string().uuid(),
  gameRoomId: z.string().uuid(),
  winnerPool: z.nativeEnum(Pool).nullable(),
  status: z.nativeEnum(RoundStatus),
  startedAt: z.coerce.date().nullable(),
  endedAt: z.coerce.date().nullable(),
});

export type Round = z.infer<typeof RoundSchema>;

export const PoolStateSchema = z.object({
  pool: z.nativeEnum(Pool),
  playerCount: z.number().int().nonnegative(),
  totalStaked: z.number().nonnegative(),
});

export type PoolState = z.infer<typeof PoolStateSchema>;

export const GameStateSchema = z.object({
  roomId: z.string().uuid(),
  roundId: z.string().uuid(),
  status: z.nativeEnum(RoundStatus),
  timeRemainingSeconds: z.number().int().nonnegative(),
  pools: z.array(PoolStateSchema),
  myPool: z.nativeEnum(Pool).nullable(),
  myStake: z.number().nonnegative().nullable(),
});

export type GameState = z.infer<typeof GameStateSchema>;
