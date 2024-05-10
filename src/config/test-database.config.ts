import { setGlobalOptions, Severity } from '@typegoose/typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { logger } from './logger.config';

setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
const mongod = MongoMemoryServer.create();

export const connect = async () => {
  try {
    const uri = (await mongod).getUri();

    await mongoose.connect(uri, {});
  } catch (error) {
    logger.error('Error connecting to the database: ', error);
  }
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await (await mongod).stop();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
