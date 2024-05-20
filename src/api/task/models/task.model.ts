import { getModelForClass, modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';

import { User } from '@/api/user/models';

import { StatusType, TaskStatus } from '../interfaces/status.interface';

@modelOptions({
  schemaOptions: {
    collection: 'tasks',
    timestamps: true,
    versionKey: false,
    strict: false,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Task {
  @prop({ type: String, required: true, unique: false })
  title: string;

  @prop({ type: String, required: true, unique: false })
  description: string;

  @prop({ enum: StatusType, default: StatusType.FULL, type: String })
  statusType: StatusType;

  @prop({ enum: TaskStatus, default: TaskStatus.OPEN, type: String })
  status: TaskStatus;

  @prop({ ref: () => User, required: false, default: null })
  assignedTo: Ref<User>;

  @prop({ ref: () => User, required: true })
  createdBy: Ref<User>;
}

export const TaskModel = getModelForClass(Task);
