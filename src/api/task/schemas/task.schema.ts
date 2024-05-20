import { z } from '@/config/zod.config';

import { TaskStatus } from '../interfaces/status.interface';

export const TaskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.nativeEnum(TaskStatus),
  assignedTo: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
