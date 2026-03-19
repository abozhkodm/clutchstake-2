import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  steamId: z.string(),
  username: z.string(),
  avatar: z.string().url().nullable(),
  balance: z.number().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UserPublicSchema = UserSchema.pick({
  id: true,
  steamId: true,
  username: true,
  avatar: true,
});

export type UserPublic = z.infer<typeof UserPublicSchema>;
