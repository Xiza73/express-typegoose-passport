import { z } from '@/config/zod.config';

export const UserSchema = z.object({
  local: z.object({
    email: z.string(),
    password: z.string(),
  }),
  google: z.object({
    id: z.string(),
    token: z.string(),
    email: z.string(),
    name: z.string(),
  }),
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LocalUserSchema = z.object({
  email: z.string(),
  password: z.string(),
});
