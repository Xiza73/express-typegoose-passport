import { UserModel } from '../models';

export const userRepository = {
  findByEmail: async (email: string) => {
    return UserModel.findOne({
      'local.email': email.toLowerCase(),
    }).exec();
  },

  findByGoogleId: async (id: string) => {
    return UserModel.findOne({
      'google.id': id,
    }).exec();
  },

  findById: async (id: string) => {
    return UserModel.findById(id).exec();
  },

  create: async (email: string, password: string) => {
    const newUser = new UserModel({
      local: {
        email,
        password,
      },
    });

    const savedUser = await newUser.save();

    return savedUser;
  },

  createGoogleUser: async ({ id, email, name, token }: { id: string; token?: string; email: string; name: string }) => {
    const newUser = new UserModel({
      google: {
        id,
        token,
        email,
        name,
      },
    });

    const savedUser = await newUser.save();

    return savedUser;
  },
};
