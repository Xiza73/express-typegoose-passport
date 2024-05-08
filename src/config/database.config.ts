import mongoose from 'mongoose';

import { env } from '@/common/utils';
import { logger } from '@/config/logger.config';

(async () => {
  try {
    logger.info('Connecting to the database...');
    await mongoose.connect(env.DB_URI, {});

    logger.info('Connected to the database');
  } catch (error) {
    logger.error('Error connecting to the database: ', error);
  }
})();
