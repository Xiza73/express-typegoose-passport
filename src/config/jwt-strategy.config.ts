import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';

import { userRepository } from '@/api/user/repositories/user.repository';
import { env } from '@/common/utils/env-config.util';

import { logger } from './logger.config';

export default passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
      passReqToCallback: true,
    },
    async (_req: Request, payload: any, done: VerifiedCallback) => {
      try {
        const user = await userRepository.findById(payload.id);

        if (!user) return done(null, false, { message: 'User not found' });

        return done(null, user);
      } catch (ex: any) {
        logger.error(ex?.message || 'There was an error');
        return done(ex, false);
      }
    }
  )
);
