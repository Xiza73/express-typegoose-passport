import { commonValidations } from '@/common/utils/common-validation.util';
import { z } from '@/config/zod.config';

export const AddInviteSchema = z.object({
  body: z.object({
    email: commonValidations.email,
  }),
});
