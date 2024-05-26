import { z } from '@/config/zod.config';

import { TaskStatus } from '../interfaces/status.interface';

export const UpdateTaskSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    status: z.nativeEnum(TaskStatus),
  }),
});
