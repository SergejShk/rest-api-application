const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../db/userModel");
const { UnauthorizedError } = require("../helpers/errors");

const authMiddleware = async (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(" ");

    if (!token) {
      next(new UnauthorizedError("Not authorized"));
    }

    const decodedUser = jwt.decode(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedUser._id);

    if (!user) {
      next(new UnauthorizedError("Not authorized"));
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError("Not authorized"));
  }
};

module.exports = {
  authMiddleware,
};
