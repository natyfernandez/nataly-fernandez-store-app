import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import { SECRET_KEY } from './../utils/jwt.js';

// "Unauthorized" es un mensaje por defecto de passport-jwt cuando falla la autenticación.

export function initializePassport() {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: SECRET_KEY,
        // ExtractJwt.fromExtractors([...]) 👇 permite definir extractores personalizados.
        // cookieExtractor es una función que extrae el token desde una cookie
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
