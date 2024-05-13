import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const Mixed = mongoose.Schema.Types.Mixed;

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    versionKey: false,
    strict: false,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class User {
  @prop({ type: Mixed })
  local: {
    email: string;
    password: string;
  };

  @prop({ type: Mixed })
  google: {
    id: string;
    token: string;
    email: string;
    name: string;
  };

  // generating a hash
  generateHash(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  // checks if password is valid
  validPassword(password: string) {
    return bcrypt.compareSync(password, this.local.password);
  }
}

export const UserModel = getModelForClass(User);
