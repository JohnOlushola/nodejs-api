const errorHandler = (err) => {
  let { message, code, description, details, statusCode, field, ...rest } = err;
  return {
    errors: {
      message,
      code,
      description,
      statusCode: statusCode,
      field,
      details: { ...rest },
    },
  };
};

export default errorHandler;
