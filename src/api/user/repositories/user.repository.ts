import { User, UserModel } from '../models';

export const userRepository = {
  // find: async (params: any): Promise<User | null> => {
  //   return UserModel.findOne(params).exec();
  // },

  findByEmail: async (email: string): Promise<User | null> => {
    return UserModel.findOne({
      'local.email': email,
    }).exec();
  },

  // findById: async (id: string): Promise<User | null> => {
  //   return UserModel.findById(id).exec();
  // },

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
};
