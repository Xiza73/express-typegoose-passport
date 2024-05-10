import { commonValidations } from '@/common/utils/common-validation.util';
import { z } from '@/config/zod.config';

export const SignUpSchema = z.object({
  body: z.object({
    email: commonValidations.email,
    password: commonValidations.password,
    repeatPassword: commonValidations.password,
  }),
});
