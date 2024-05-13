import { commonValidations } from '@/common/utils/common-validation.util';
import { z } from '@/config/zod.config';

export const SignInSchema = z.object({
  body: z.object({
    email: commonValidations.email,
    password: commonValidations.password,
  }),
});

export const UserSignedInSchema = z.object({
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
  token: z.string(),
});
