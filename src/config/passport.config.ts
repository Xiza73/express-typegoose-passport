import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';

import { inviteRepository } from '@/api/auth/repositories/invite.repository';
import { userRepository } from '@/api/user/repositories/user.repository';
import { env } from '@/common/utils/env-config.util';

import { logger } from './logger.config';

passport.use(
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

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails![0].value;
        if (!email) return done(null, false, { message: 'Email not found' });

        let user = await userRepository.findByGoogleId(profile.id);

        if (!user) {
          const invite = await inviteRepository.find(email);
          if (!invite) return done(null, false, { message: 'User not invited' });

          user = await userRepository.createGoogleUser({
            id: profile.id,
            email,
            name: profile.displayName,
            token: profile.id,
          });

          if (!user) return done(null, false, { message: 'User not found' });
        }

        return done(null, user);
      } catch (ex: any) {
        logger.error(ex?.message || 'There was an error');
        return done(ex, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id || user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.findById(id);

    if (!user) return done(null, false);

    return done(null, user);
  } catch (ex: any) {
    logger.error(ex?.message || 'There was an error');
    return done(ex, false);
  }
});

export default passport;
