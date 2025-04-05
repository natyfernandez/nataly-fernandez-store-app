import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import { CONFIG } from "./config.js";

export function initializePassport() {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: CONFIG.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      (payload, done) => {
        try {
          console.log(payload);

          return done(null, payload);

        } catch (error) {
          done(error);
        }
      }
    )
  );
}

function cookieExtractor(req) {
  return req.cookies.jwt ? req.cookies.jwt : null;
}
