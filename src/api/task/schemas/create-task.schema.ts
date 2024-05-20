import { z } from '@/config/zod.config';

export const CreateTaskSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
  }),
});
