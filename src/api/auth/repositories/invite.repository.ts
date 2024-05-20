import { InviteModel } from '../models/invite.model';

export const inviteRepository = {
  find: async (email: string) => {
    return InviteModel.findOne({
      email,
    }).exec();
  },

  create: async (email: string) => {
    const newInvite = new InviteModel({
      email,
    });

    const savedInvite = await newInvite.save();

    return savedInvite;
  },
};
