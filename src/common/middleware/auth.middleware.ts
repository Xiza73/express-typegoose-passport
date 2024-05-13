import passport from 'passport';

export const passAuth = (type: string) => {
  return passport.authenticate(type, {
    session: false,
    passReqToCallback: true,
  });
};
