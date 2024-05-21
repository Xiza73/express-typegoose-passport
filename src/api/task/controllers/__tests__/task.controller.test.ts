import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { taskController } from '../task.controller';

vi.mock('../../services/task.service', () => ({
  taskService: {
    create: vi.fn(() => ({
      success: true,
      message: 'Task created',
      responseObject: {
        _id: '1234567890',
        title: 'Task 1',
        description: 'Task 1 description',
      },
      statusCode: StatusCodes.CREATED,
    })),
    list: vi.fn(() => ({
      success: true,
      message: 'Tasks found',
      responseObject: [],
      statusCode: StatusCodes.OK,
    })),
  },
}));

const res = {
  status: vi.fn(() => res),
  send: vi.fn(),
  json: vi.fn(),
} as unknown as Response;

beforeAll(() => {
  vi.clearAllMocks();
});

describe('Task Controller', () => {
  describe('createTask', () => {
    it('should create a task', async () => {
      // Arrange
      const req = {
        body: {
          title: 'Task 1',
          description: 'Task 1 description',
        },
        userAuth: {
          _id: '1234567890',
        },
      } as unknown as Request;

      // Act
      await taskController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Task created',
        responseObject: {
          _id: '1234567890',
          title: 'Task 1',
          description: 'Task 1 description',
        },
        statusCode: StatusCodes.CREATED,
      });
    });
  });

  describe('listTasks', () => {
    it('should list tasks', async () => {
      // Arrange
      const req = {
        query: {
          page: 1,
          limit: 10,
          title: 'Task 1',
        },
        userAuth: {
          _id: '1234567890',
        },
      } as unknown as Request;

      // Act
      await taskController.list(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: 'Tasks found',
        responseObject: [],
        statusCode: StatusCodes.OK,
      });
    });
  });
});
