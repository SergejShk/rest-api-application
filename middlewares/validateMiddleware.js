const Joi = require("joi");
const { WrongParametersError } = require("../helpers/errors");

const validateAuth = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
    password: Joi.string().min(7).max(15).required(),
  });

  const validateBody = schema.validate(req.body);
  const { error } = validateBody;

  if (error) {
    console.log(error);
    const [objErr] = error.details;

    throw new WrongParametersError(objErr.message);
  }

  next();
};

module.exports = {
  validateAuth,
};
