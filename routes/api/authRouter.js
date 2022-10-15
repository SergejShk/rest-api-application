const express = require("express");
const { asyncWrapper } = require("../../helpers/asyncWrapper");
const { uploadMiddleware } = require("../../middlewares/uploadMiddleware");

const {
  signupController,
  loginController,
  logoutController,
  currentController,
  uploadAvatarController,
  verifyController,
  verifyResendController,
} = require("../../controllers/authController");
const { validateAuth } = require("../../middlewares/validateMiddleware");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { resendVerify } = require("../../middlewares/resendMiddleware");

const router = express.Router();

router.post("/signup", validateAuth, asyncWrapper(signupController));

router.post("/login", validateAuth, asyncWrapper(loginController));

router.patch("/logout", authMiddleware, asyncWrapper(logoutController));

router.get("/current", authMiddleware, asyncWrapper(currentController));

router.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  asyncWrapper(uploadAvatarController)
);

router.get("/verify/:verificationToken", asyncWrapper(verifyController));

router.post("/verify/", resendVerify, asyncWrapper(verifyResendController));

module.exports = { authRouter: router };
