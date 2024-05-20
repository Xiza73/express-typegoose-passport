import { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import { Document, Types } from 'mongoose';

import { User } from './api/user/models';

declare module 'express' {
  interface Request {
    userAuth?:
      | (Document<unknown, BeAnObject, User> &
          Omit<
            User & {
              _id: Types.ObjectId;
            },
            'typegooseName'
          > &
          IObjectWithTypegooseFunction)
      | null;
  }
}
