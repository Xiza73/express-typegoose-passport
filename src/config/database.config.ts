import { setGlobalOptions, Severity } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import { env } from '@/common/utils/env-config.util';
import { logger } from '@/config/logger.config';

(async () => {
  try {
    logger.info('Connecting to the database...');
    setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
    const db = await mongoose.connect(env.DB_URI, {});

    logger.info(`Connected to the database: ${db.connection.db.databaseName}`);
  } catch (error) {
    logger.error('Error connecting to the database: ', error);
  }
})();
