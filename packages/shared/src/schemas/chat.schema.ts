import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  username: z.string(),
  avatar: z.string().url().nullable(),
  content: z.string().min(1).max(500),
  createdAt: z.coerce.date(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SendChatMessageSchema = z.object({
  content: z.string().min(1).max(500),
});

export type SendChatMessage = z.infer<typeof SendChatMessageSchema>;
