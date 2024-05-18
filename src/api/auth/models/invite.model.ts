import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    collection: 'invites',
    timestamps: true,
    versionKey: false,
    strict: false,
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Invite {
  @prop({ type: String, required: true, unique: true })
  email: string;
}

export const InviteModel = getModelForClass(Invite);
