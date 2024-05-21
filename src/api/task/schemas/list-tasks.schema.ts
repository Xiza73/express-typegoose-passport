import { UserSchema } from '@/api/user/schemas';
import { commonValidations } from '@/common/utils/common-validation.util';
import { z } from '@/config/zod.config';

export const ListTasksSchema = z.object({
  query: z.object({
    page: commonValidations.page,
    limit: commonValidations.limit,
    title: z.string().optional(),
  }),
});

export const ListTasksResponseSchema = z.object({
  data: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.string(),
      createdBy: UserSchema,
      assignedTo: UserSchema,
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  total: z.number(),
  pages: z.number(),
  page: z.number(),
});
