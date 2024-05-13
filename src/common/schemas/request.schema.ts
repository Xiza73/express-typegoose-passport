import { z } from 'zod';

export const RequestHeaderSchema = {
  headers: z.object({
    accesstoken: z.string().optional(),
  }),
};
