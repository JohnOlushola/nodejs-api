import jwt from "jsonwebtoken";
import passport from "passport";
import { validate } from "validate.js";

import errorHandler from "../helpers/errorHandler";
import validationRules from "../helpers/validate";

class authController {
  login(req, res) {
    // validate
    let validationError;

    // validate body
    validationError = validate(req.body, validationRules.login);
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    passport.authenticate("local", { session: false }, (err, user) => {
      if (err || !user) {
        return res
          .status(err.statusCode)
          .send(errorHandler({ message: err.message }));
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        // generate a signed json web token with the contents of user object and return it in the response
        const token = jwt.sign(user, process.env.AUTH_TOKEN_SECRET);
        return res.json({ user, token });
      });
    })(req, res);
  }
}

export default new authController();
