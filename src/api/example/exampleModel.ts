import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/common-validation.util';

extendZodWithOpenApi(z);

export type Example = z.infer<typeof ExampleSchema>;
export const ExampleSchema = z.object({
  id: commonValidations._id,
  name: z.string(),
  email: commonValidations.email,
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET Examples/:id' endpoint
export const GetExampleSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
