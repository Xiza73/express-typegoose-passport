import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/service-response.model';
import { logger } from '@/config/logger.config';

import { Example } from './exampleModel';
import { exampleRepository } from './exampleRepository';

export const exampleService = {
  // Retrieves all examples from the database
  findAll: async (): Promise<ServiceResponse<Example[] | null>> => {
    try {
      const examples = await exampleRepository.findAllAsync();
      if (!examples) {
        return new ServiceResponse(ResponseStatus.Failed, 'No Examples found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Example[]>(ResponseStatus.Success, 'Examples found', examples, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all examples: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single example by their ID
  findById: async (id: number): Promise<ServiceResponse<Example | null>> => {
    try {
      const example = await exampleRepository.findByIdAsync(id);
      if (!example) {
        return new ServiceResponse(ResponseStatus.Failed, 'Example not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Example>(ResponseStatus.Success, 'Example found', example, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding example with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
