import { validate } from "validate.js";

export let validationRules = {
  login: {
    email: {
      presence: {
        allowEmpty: false,
        message: "^Email address is required",
      },
      email: {
        message: "^Email address must be valid",
      },
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: "^Must be at least 6 characters",
      },
    },
  },

  register: {
    email: {
      presence: {
        allowEmpty: false,
        message: "^Email address is required",
      },
      email: {
        message: "^Email address must be valid",
      },
    },
    firstname: {
      presence: {
        allowEmpty: false,
        message: "^Firstname is required",
      },
    },
    lastname: {
      presence: {
        allowEmpty: false,
        message: "^Lastname is required",
      },
    },
    password: {
      presence: {
        allowEmpty: false,
        message: "^Password is required",
      },
      length: {
        minimum: 6,
        message: "^Must be at least 6 characters",
      },
    },
  },

  product: {
    name: {
      presence: {
        allowEmpty: false,
        message: "^Product name is required",
      },
    },
    description: {
      presence: {
        allowEmpty: false,
        message: "^Product description is required",
      },
    },
    price: {
      presence: {
        allowEmpty: false,
        message: "^Product price is required",
      },
      type: "number",
    },
    productId: {
      presence: {
        allowEmpty: false,
        message: "^Product id is required",
      },
    },
  },

  cart: {
    action: {
      presence: {
        allowEmpty: false,
        message: "^action is required",
      },
      type: "string",
    },
    productId: {
      presence: {
        allowEmpty: false,
        message: "^Product id is required",
      },
      type: "string",
    },
  },
};

export const errorParser = (error) => {
  let errors = "";
  if (error !== undefined && error.length >= 2) {
    for (let i = 0; i < error.length; i++) {
      errors += `${error[i]}, `;
    }
    return errors.substring(0, errors.length - 2);
  }

  return error;
};

export default validationRules;
