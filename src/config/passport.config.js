import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

const SECRET_KEY = 's3cr3t';

export function initializePassport() {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      (payload, done) => {
        try {
          console.log(payload);

          if (payload.email !== "admin@gmail.com") {
            return done(null, false);
          }

          return done(null, payload);

        } catch (error) {
          done(error);
        }
      }
    )
  );
}

function cookieExtractor(req) {
  return req.cookies.token ? req.cookies.token : null;
}
