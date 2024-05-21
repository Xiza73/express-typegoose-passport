import { Request } from 'express';

export const getUserId = (req: Request): string => req.userAuth?._id?.toString() || '';
