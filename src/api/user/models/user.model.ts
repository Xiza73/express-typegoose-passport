import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const Mixed = mongoose.Schema.Types.Mixed;

const generateHash = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

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
  @prop({
    type: Mixed,
    set: (v: { email: string; password: string }) => ({
      email: v.email.toLowerCase(),
      password: generateHash(v.password),
    }),
  })
  local: {
    email: string;
    password: string;
  };

  @prop({ type: Mixed })
  google: {
    id: string;
    token?: string;
    email: string;
    name: string;
  };

  // checks if password is valid
  validPassword(password: string) {
    return bcrypt.compareSync(password, this.local.password);
  }
}

export const UserModel = getModelForClass(User);
