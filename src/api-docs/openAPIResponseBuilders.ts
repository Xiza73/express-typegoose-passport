import { ResponseConfig } from '@asteasolutions/zod-to-openapi';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { getCodeDescription } from '@/common/enums';
import { ServiceResponseSchema } from '@/common/models/serviceResponse';

export function createApiResponse(schema: z.ZodTypeAny, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description: getCodeDescription(statusCode),
      content: {
        'application/json': {
          schema: ServiceResponseSchema(schema),
        },
      },
    },
  };
}

// Use if you want multiple responses for a single endpoint

export interface ApiResponseConfig {
  schema: z.ZodTypeAny;
  statusCode: StatusCodes;
}

export function createApiResponses(configs: ApiResponseConfig[]) {
  const responses: { [key: string]: ResponseConfig } = {};
  configs.forEach(({ schema, statusCode }) => {
    responses[statusCode] = {
      description: getCodeDescription(statusCode),
      content: {
        'application/json': {
          schema: ServiceResponseSchema(schema),
        },
      },
    };
  });
  return responses;
}
