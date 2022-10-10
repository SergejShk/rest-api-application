const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();
const { User } = require("../db/userModel");
const { updateAvatar } = require("../helpers/updateAvatar");
const {
  UnauthorizedError,
  RegistrationConflictError,
  WrongParametersError,
} = require("../helpers/errors");

const signup = async (email, password) => {
  try {
    const user = new User({ email, password, avatarURL: gravatar.url(email) });

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

const uploadAvatar = async (userId, file) => {
  try {
    const { path: tmpDir, originalname } = file;
    const [extension] = originalname.split(".").reverse();
    const newNameAvatar = `${userId}.${extension}`;

    console.log(updateAvatar);
    await updateAvatar(file, tmpDir);

    const uploadDir = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      newNameAvatar
    );

    await fs.rename(tmpDir, uploadDir);

    return await User.findByIdAndUpdate(
      userId,
      { avatarURL: path.join("avatars", newNameAvatar) },
      { new: true }
    );
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUserById,
  uploadAvatar,
};
