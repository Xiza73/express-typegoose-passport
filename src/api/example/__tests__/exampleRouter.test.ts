import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@/common/models/service-response.model';
import { app } from '@/config/server.config';

import { Example } from '../exampleModel';
import { examples } from '../exampleRepository';

describe('Example API Endpoints', () => {
  describe('GET /api/examples', () => {
    it('should return a list of examples', async () => {
      // Act
      const response = await request(app).get('/api/examples');
      const responseBody: ServiceResponse<Example[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Examples found');
      expect(responseBody.responseObject.length).toEqual(examples.length);
      responseBody.responseObject.forEach((example, index) => compareExamples(examples[index] as Example, example));
    });
  });

  describe('GET /api/examples/:id', () => {
    it('should return a example for a valid ID', async () => {
      // Arrange
      const testId = 1;
      const expectedExample = examples.find((example) => example.id === testId) as Example;

      // Act
      const response = await request(app).get(`/api/examples/${testId}`);
      const responseBody: ServiceResponse<Example> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Example found');
      if (!expectedExample) throw new Error('Invalid test data: expectedExample is undefined');
      compareExamples(expectedExample, responseBody.responseObject);
    });

    it('should return a not found error for non-existent ID', async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/api/examples/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Example not found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for invalid ID format', async () => {
      // Act
      const invalidInput = 'abc';
      const response = await request(app).get(`/api/examples/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareExamples(mockExample: Example, responseExample: Example) {
  if (!mockExample || !responseExample) {
    throw new Error('Invalid test data: mockExample or responseExample is undefined');
  }

  expect(responseExample.id).toEqual(mockExample.id);
  expect(responseExample.name).toEqual(mockExample.name);
  expect(responseExample.email).toEqual(mockExample.email);
  expect(responseExample.age).toEqual(mockExample.age);
  expect(new Date(responseExample.createdAt)).toEqual(mockExample.createdAt);
  expect(new Date(responseExample.updatedAt)).toEqual(mockExample.updatedAt);
}
