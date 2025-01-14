const {
  signup,
  login,
  getUserById,
  logout,
  uploadAvatar,
  confirmEmail,
  resendEmail,
} = require("../services/authService");
const { UnauthorizedError } = require("../helpers/errors");

const signupController = async (req, res) => {
  const { email, password } = req.body;

  const data = await signup(email, password);

  const subscription = data.subscription ? data.subscription : "starter";

  res.status(201).json({
    user: {
      email: data.email,
      avatarURL: data.avatarURL,
      subscription,
    },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const data = await login(email, password);
  const subscription = data.subscription ? data.subscription : "starter";

  res.status(200).json({
    token: data.token,
    user: {
      email: data.user.email,
      subscription,
    },
  });
};

const logoutController = async (req, res) => {
  const token = req.token;
  const { _id: owner } = req.user;

  if (!token) {
    throw new UnauthorizedError("Not authorized");
  } else {
    await logout(owner);

    req.headers.authorization = null;
    req.token = null;

    return res.status(204).json({ message: "No Content" });
  }
};

const currentController = async (req, res) => {
  const { _id: userId } = req.user;

  const user = await getUserById(userId);

  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const uploadAvatarController = async (req, res) => {
  const { _id: userId } = req.user;

  const user = await uploadAvatar(userId, req.file);

  const { avatarURL } = user;

  res.status(200).json({ avatarURL });
};

const verifyController = async (req, res) => {
  await confirmEmail(req.params.verificationToken);

  res.status(200).json({ message: "Verification successful" });
};

const verifyResendController = async (req, res) => {
  await resendEmail(req.body.email);

  res.status(200).json("Verification email sent");
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  currentController,
  uploadAvatarController,
  verifyController,
  verifyResendController,
};
