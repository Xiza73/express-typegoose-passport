import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Example } from '@/api/example/exampleModel';
import { exampleRepository } from '@/api/example/exampleRepository';
import { exampleService } from '@/api/example/exampleService';

vi.mock('@/api/example/exampleRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('exampleService', () => {
  const mockExamples: Example[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 42, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 21, createdAt: new Date(), updatedAt: new Date() },
  ];

  describe('findAll', () => {
    it('return all examples', async () => {
      // Arrange
      (exampleRepository.findAllAsync as Mock).mockReturnValue(mockExamples);

      // Act
      const result = await exampleService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Examples found');
      expect(result.responseObject).toEqual(mockExamples);
    });

    it('returns a not found error for no examples found', async () => {
      // Arrange
      (exampleRepository.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await exampleService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No Examples found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAllAsync', async () => {
      // Arrange
      (exampleRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await exampleService.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding all examples');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns a example for a valid ID', async () => {
      // Arrange
      const testId = 1;
      const mockExample = mockExamples.find((example) => example.id === testId);
      (exampleRepository.findByIdAsync as Mock).mockReturnValue(mockExample);

      // Act
      const result = await exampleService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Example found');
      expect(result.responseObject).toEqual(mockExample);
    });

    it('handles errors for findByIdAsync', async () => {
      // Arrange
      const testId = 1;
      (exampleRepository.findByIdAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await exampleService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error finding example with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = 1;
      (exampleRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await exampleService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Example not found');
      expect(result.responseObject).toBeNull();
    });
  });
});
