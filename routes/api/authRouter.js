const express = require("express");
const { asyncWrapper } = require("../../helpers/asyncWrapper");

const {
  signupController,
  loginController,
  logoutController,
  currentController,
} = require("../../controllers/authController");
const { validateAuth } = require("../../middlewares/validateMiddleware");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", validateAuth, asyncWrapper(signupController));

router.post("/login", validateAuth, asyncWrapper(loginController));

router.patch("/logout", authMiddleware, asyncWrapper(logoutController));

router.get("/current", authMiddleware, asyncWrapper(currentController));

module.exports = { authRouter: router };
