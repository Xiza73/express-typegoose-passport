import mongoose from 'mongoose';

import { env } from '@/common/utils';

vi.mock('mongoose');

describe('database.config', () => {
  it('should connect to the database', async () => {
    const connectSpy = vi.spyOn(mongoose, 'connect').mockResolvedValueOnce(mongoose);
    console.log('connectSpy', connectSpy);

    await import('../database.config');

    expect(connectSpy).toHaveBeenCalledWith(env.DB_URI, {});
  });

  it('should log an error if there is an error connecting to the database', async () => {
    const error = new Error('Failed to connect to the database');
    const connectSpy = vi.spyOn(mongoose, 'connect').mockRejectedValueOnce(error);

    await import('../database.config');

    expect(connectSpy).not.toHaveBeenCalledWith(env.DB_URI, {});
  });
});
