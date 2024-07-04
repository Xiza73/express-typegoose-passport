export const BasicTaskStatus = {
  OPEN: 'Open',
  DONE: 'Done',
} as const;
export type BasicTaskStatus = (typeof BasicTaskStatus)[keyof typeof BasicTaskStatus];

export const TaskStatus = {
  ...BasicTaskStatus,
  IN_PROGRESS: 'In Progress',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const StatusType = {
  BASIC: 'Basic',
  FULL: 'Full',
} as const;
export type StatusType = (typeof StatusType)[keyof typeof StatusType];
