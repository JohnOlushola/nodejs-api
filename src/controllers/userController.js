import { User, Product } from "../database/models/index";
import errorHandler from "../helpers/errorHandler";
import validationRules from "../helpers/validate";
import { validate } from "validate.js";

class userController {
  // create
  async create(req, res) {
    const { body } = req;
    let validationError;

    // validate body
    validationError = validate(body, validationRules.register);
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    // create user
    await User.create(body)
      .then((user) => {
        return res.status(200).json({
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        });
      })
      .catch((err) => {
        return res.status(400).send(
          errorHandler({
            message: err.message,
          })
        );
      });
  }

  // read
  async read(req, res) {
    const { email } = req.params;
    let validationError;

    // validate
    validationError = validate.single(
      email.trim(),
      validationRules.register.email
    );
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    // find user
    await User.findOne({ email: email }, (err, user) => {
      if (err) {
        return status(500).send(errorHandler(err));
      }

      if (!user) {
        return res.status(404).send(
          errorHandler({
            message: `User with email: ${email} could not be found.`,
          })
        );
      }

      return res.send(user);
    });
  }

  // get cart
  async getCart(req, res) {
    User.findOne({ email: req.user.email })
      .then((user) => {
        return res.send(user.cart);
      })
      .catch((err) => {
        return res.status(500).send(errorHandler(err));
      });
  }

  // add to cart
  async setCart(req, res) {
    let { action, productId } = req.params;
    let validationError;

    // validate
    validationError = validate(
      {
        action,
        productId,
      },
      validationRules.cart
    );
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    switch (action.toLowerCase()) {
      case "add":
        // find product
        await Product.findOne({
          _id: productId,
        })
          .then(async (product) => {
            if (product != null) {
              // update user's cart
              await User.updateOne(
                {
                  email: req.user.email,
                },
                {
                  $push: {
                    cart: product,
                  },
                }
              )
                .then((user) => {
                  return res.send(user);
                })
                .catch((err) => {
                  return res.status(500).send(errorHandler(err));
                });
            }
            return res.status(404).send(
              errorHandler({
                message: `Product with productId: ${productId} could not be found`,
              })
            );
          })
          .catch((err) => {
            return res.status(500).send(errorHandler(err));
          });
        break;
      // push product

      case "remove":
        await User.updateOne(
          {
            email: req.user.email,
          },
          {
            $pull: {
              cart: {
                _id: productId,
              },
            },
          }
        )
          .then((update) => {
            return res.send(update);
          })
          .catch((err) => {
            return res.status(400).send(
              errorHandler({
                message:
                  "Product could not be removed from cart. Product is not in cart.",
                err,
              })
            );
          });
        break;

      default:
        return res.status(412).send(
          errorHandler({
            message: `The action: ${action} is invalid.`,
          })
        );
    }
  }
}

export default new userController();
