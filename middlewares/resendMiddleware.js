const Joi = require("joi");
const { WrongParametersError } = require("../helpers/errors");

const resendVerify = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
  });

  const validateBody = schema.validate(req.body);
  const { error } = validateBody;

  if (error) {
    const [objErr] = error.details;

    throw new WrongParametersError(objErr.message);
  }

  next();
};

module.exports = {
  resendVerify,
};
