import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UnauthorizedException } from "../utils/app-error";
import { Env } from "./env.config";
import { findByIdUserService } from "../services/user.service";



passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([ // extract le token du cookie
        (req) => {
          const token = req.cookies.accessToken;
          if (!token) throw new UnauthorizedException("Unauthorized access");
          return token;
        },
      ]), // extract le token du cookie
      secretOrKey: Env.JWT_SECRET,
      audience: ["user"],
      algorithms: ["HS256"],
    }, // verifie que le token est bien jwt
    async ({ userId }, done) => { // fonction qui va chercher l'utilisateur dans la base de données à partir de l'id contenu dans le token
      try {
        const user = userId && (await findByIdUserService(userId));
        return done(null, user || false);
      } catch (error) {
        return done(null, false); // req.user = userId 
      }
    }
  )
);

export const passportAuthenticateJwt = passport.authenticate("jwt", {
  session: false,
}); // permet d avoir un meme user connecter sur plusieurs appareils ou onglet ?