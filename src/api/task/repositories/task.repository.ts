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
};
