import { StatusCodes } from 'http-status-codes';

export const CodeDescription: {
  [key in StatusCodes]?: string;
} = {
  [StatusCodes.OK]: 'Success',
} as const;
export type CodeDescription = (typeof CodeDescription)[keyof typeof CodeDescription];

export const getCodeDescription = (code: StatusCodes): string => {
  return CodeDescription[code] ?? 'Unknown';
};
