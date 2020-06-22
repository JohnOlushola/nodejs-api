import passport from "passport";
import passportJWT from "passport-jwt";
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

import { User } from "../database/models";
import redis from "redis";

const client = redis.createClient(process.env.REDIS || 6379);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      email = email.toLowerCase().trim();
      password = password.trim();

      return await User.findOne(
        { email: email },
        { firstname: 1, lastname: 1, password: 1, email: 1 }
      )
        .then((user) => {
          if (!user) {
            let err = {
              message: "User not found",
              statusCode: 404,
            };
            return cb(err, false);
          }
          if (!user || user.validatePassword(user, password) === false) {
            let err = {
              message: "Incorrect email or password",
              statusCode: 401,
            };
            return cb(err, false);
          }

          user = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
          };

          return cb(null, user, {
            message: "Logged in successfully",
          });
        })
        .catch((err) => cb(err));
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_TOKEN_SECRET,
    },
    (jwtPayload, callback) => {
      const userKey = jwtPayload.email;

      // fetch from cache
      return client.get(userKey, (err, user) => {
        if (user) {
          console.log({ source: "cache" });
          return callback(null, JSON.parse(user));
        }

        // fetch from db
        User.findOne({ id: jwtPayload.id })
          .then((user) => {
            // save to cache
            console.log({ source: "database" });

            client.setex(userKey, 3600, JSON.stringify(user));

            return callback(null, user.toJSON());
          })
          .catch((err) => callback(err));
      });
    }
  )
);

export default passport;
