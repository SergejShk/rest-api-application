const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User } = require("../db/userModel");
const {
  UnauthorizedError,
  RegistrationConflictError,
  WrongParametersError,
} = require("../helpers/errors");

const signup = async (email, password) => {
  try {
    const user = new User({ email, password });

    await user.save();
    return user;
  } catch (error) {
    throw new RegistrationConflictError("Email in use");
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Email or password is wrong");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    return { token, user };
  } catch (error) {
    throw new UnauthorizedError("Email or password is wrong");
  }
};

const logout = async (owner) => {
  const user = await User.findByIdAndUpdate(owner, { token: null });
  return user;
};

const getUserById = async (userId) => {
  try {
    const user = await User.findOne(userId);

    if (!user) {
      throw new UnauthorizedError("Not authorized");
    }

    return user;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUserById,
};
