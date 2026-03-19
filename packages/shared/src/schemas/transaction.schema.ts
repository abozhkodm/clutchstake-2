import { z } from 'zod';
import { TransactionStatus, TransactionType } from '../enums';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  amount: z.number(),
  status: z.nativeEnum(TransactionStatus),
  txHash: z.string().nullable(),
  meta: z.record(z.unknown()).nullable(),
  createdAt: z.coerce.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
