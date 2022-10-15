const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();
const { User } = require("../db/userModel");
const { updateAvatar } = require("../helpers/updateAvatar");
const {
  UnauthorizedError,
  RegistrationConflictError,
  WrongParametersError,
  NotFoundError,
} = require("../helpers/errors");
const { sendEmail } = require("../helpers/sendEmail");

const signup = async (email, password) => {
  const verificationToken = uuidv4();

  try {
    const user = new User({
      email,
      password,
      avatarURL: gravatar.url(email),
      verificationToken,
    });

    await user.save();

    sendEmail({
      to: email,
      subject: "Confirm email",
      html: `<a href='http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}'>Confirm Email</a>`,
    });

    return user;
  } catch (error) {
    throw new RegistrationConflictError("Email in use");
  }
};

const confirmEmail = async (verificationToken) => {
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new NotFoundError("Not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
  } catch (error) {
    throw new NotFoundError("Not found");
  }
};

const resendEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthorizedError("Email is wrong");
    }

    if (user.verify) {
      throw new WrongParametersError("Verification has already been passed");
    }

    sendEmail({
      to: email,
      subject: "Confirm email",
      html: `<a href='http://localhost:${process.env.PORT}/api/users/verify/${user.verificationToken}'>Confirm Email</a>`,
    });
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user.verify) {
      throw new UnauthorizedError("Not verified");
    }

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
  confirmEmail,
  resendEmail,
};
