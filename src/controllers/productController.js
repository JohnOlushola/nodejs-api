import { validate } from "validate.js";

import { Product } from "../database/models/index";
import validationRules from "../helpers/validate";
import errorHandler from "../helpers/errorHandler";

class productController {
  // create
  async create(req, res) {
    const { body } = req;
    let validationError;

    // validate body
    validationError = validate(body, validationRules.product);
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    // create product
    await Product.create(body)
      .then((product) => {
        return res.status(200).json(product);
      })
      .catch((err) => {
        return res.status(400).send(errorHandler({ message: err.message }));
      });
  }

  // read
  async read(req, res) {
    const { id } = req.params;
    let validationError;

    // validate
    validationError = validate.single(
      id.trim(),
      validationRules.product.productId
    );
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    // find product
    await Product.findOne({ _id: _id })
      .then((product) => {
        if (!product) {
          return res.status(404).send(
            errorHandler({
              message: `Product with id: ${_id} could not be found.`,
            })
          );
        }

        return res.send(product);
      })
      .catch((err) => {
        return status(500).send(errorHandler(err));
      });
  }

  // find all products
  async all(req, res) {
    await Product.find()
      .then((products) => {
        return res.send(products);
      })
      .catch((err) => {
        if (err) {
          return status(500).send(errorHandler(err));
        }
      });
  }

  // delete
  async delete(req, res) {
    const { productId } = req.params;
    let validationError;

    // validate
    validationError = validate.single(
      productId.trim(),
      validationRules.product.productId
    );
    if (validationError) {
      return res.status(422).json({
        message: {
          errors: validationError,
        },
      });
    }

    await Product.findOneAndDelete({ productId: productId })
      .then((done) => {
        if (!done) {
          return res.status(404).send(
            errorHandler({
              message: `Product with product id: ${productId} could not be found.`,
            })
          );
        }

        return res.status(204).end();
      })
      .catch((err) => {
        return res.status(400).send(
          errorHandler({
            message: `Product with product id: ${productId} could not be deleted.`,
            details: err.message,
          })
        );
      });
  }
}

export default new productController();
