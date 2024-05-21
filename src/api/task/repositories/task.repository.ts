import { Types } from 'mongoose';

import { TaskModel } from '../models/task.model';

export const taskRepository = {
  create: async (title: string, description: string, userId: Types.ObjectId) => {
    const newTask = new TaskModel();
    newTask.title = title;
    newTask.description = description;
    newTask.createdBy = userId;
    newTask.assignedTo = userId;

    const savedTask = await newTask.save();

    return savedTask;
  },

  list: async (userId: string, { page = 1, limit = 10, title }: { page: number; limit: number; title?: string }) => {
    const result = await TaskModel.aggregate([
      {
        $match: {
          title: { $regex: title || '', $options: 'i' },
          createdBy: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedTo',
        },
      },
      {
        $unwind: '$assignedTo',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $unwind: '$createdBy',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdBy: 1,
          assignedTo: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $facet: {
          tasks: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
          ],
          total: [
            {
              $count: 'total',
            },
          ],
        },
      },
    ]);

    if (!result.length || !result[0]?.total?.[0]) return { tasks: [], total: 0 };

    const tasks = result[0].tasks;
    const total = result[0].total[0].total;

    return { tasks, total };
  },
};
