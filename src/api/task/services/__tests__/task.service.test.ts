import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/repositories/user.repository';
import { env } from '@/common/utils/env-config.util';
import { clearDatabase, closeDatabase, connect } from '@/config/test-database.config';

import { taskService } from '../task.service';

beforeAll(async () => await connect());

afterEach(async () => await clearDatabase());

afterAll(async () => await closeDatabase());

describe('TaskService', () => {
  describe('createTask', () => {
    it('should create a task', async () => {
      // Arrange
      const user = await userRepository.create(env.TEST_EMAIL, env.TEST_PASSWORD);
      const response = await taskService.create('Task 1', 'Task 1 description', user._id.toString());

      expect(response.statusCode).toBe(StatusCodes.CREATED);
      expect(response.message).toBe('Task created');
      expect(response.responseObject).toHaveProperty('_id');
    });

    it('should not create a task if user ID is missing', async () => {
      // Arrange
      const response = await taskService.create('Task 1', 'Task 1 description');

      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.message).toBe('User ID is required');
      expect(response.responseObject).toBeNull();
    });

    it('should not create a task  if user ID is not a valid ID', async () => {
      // Arrange
      const response = await taskService.create('Task 1', 'Task 1 description', 'fake-user-id');

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.responseObject).toBeNull();
    });

    it('should not create a tas if user is not found', async () => {
      // Arrange
      const validObjectId = '5f3f8d3b7b3e6d1f7c7b3e6d';
      const response = await taskService.create('Task 1', 'Task 1 description', validObjectId);

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.responseObject).toBeNull();
    });
  });

  describe('listTasks', () => {
    it('should list tasks', async () => {
      // Arrange
      const user = await userRepository.create(env.TEST_EMAIL, env.TEST_PASSWORD);
      await taskService.create('Task 1', 'Task 1 description', user._id.toString());
      await taskService.create('Task 2', 'Task 2 description', user._id.toString());

      const response = await taskService.list(user._id.toString(), { page: 1, limit: 10 });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.message).toBe('Tasks retrieved');
      expect(response.responseObject.data).toHaveLength(2);
    });

    it('should return an empty list if no tasks are found', async () => {
      // Arrange
      const user = await userRepository.create(env.TEST_EMAIL, env.TEST_PASSWORD);
      const response = await taskService.list(user._id.toString(), { page: 1, limit: 10 });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.message).toBe('Tasks retrieved');
      expect(response.responseObject.data).toHaveLength(0);
    });

    it('should return an empty list if user ID is not a valid ID', async () => {
      // Arrange
      const response = await taskService.list('fake-user-id', { page: 1, limit: 10 });

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.responseObject).toHaveProperty('data');
      expect(response.responseObject.data).toHaveLength(0);
    });

    it('should return an empty list if user is not found', async () => {
      // Arrange
      const validObjectId = '5f3f8d3b7b3e6d1f7c7b3e6d';
      const response = await taskService.list(validObjectId, { page: 1, limit: 10 });

      expect(response.statusCode).toBe(StatusCodes.OK);
      expect(response.responseObject).toHaveProperty('data');
      expect(response.responseObject.data).toHaveLength(0);
    });
  });
});
