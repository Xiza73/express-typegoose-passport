import { User, UserModel } from '../models';

export const userRepository = {
  findByEmail: async (email: string) => {
    return UserModel.findOne({
      'local.email': email,
    }).exec();
  },

  findByGoogleId: async (id: string): Promise<User | null> => {
    return UserModel.findOne({
      'google.id': id,
    }).exec();
  },

  findById: async (id: string): Promise<User | null> => {
    return UserModel.findById(id).exec();
  },

  create: async (email: string, password: string): Promise<User> => {
    const newUser = new UserModel({
      local: {
        email,
        password,
      },
    });

    newUser.local.password = newUser.generateHash(password);

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Error creating user');

    return savedUser;
  },

  createGoogleUser: async ({
    id,
    email,
    name,
    token,
  }: {
    id: string;
    token?: string;
    email: string;
    name: string;
  }): Promise<User> => {
    const newUser = new UserModel({
      google: {
        id,
        token,
        email,
        name,
      },
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Error creating user');

    return savedUser;
  },
};
