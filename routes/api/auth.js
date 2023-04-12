const express = require("express");
const { validation } = require("../../middlewares/validation");
const { authenticate } = require("../../middlewares/authenticate");
const {
  registerSchema,
  loginSchema,
  userVerifyJoiSchema,
} = require("../../schemas/users");
const { ctrlWrapper } = require("../../middlewares/catchAsyncWrapper");
const {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
  updateAvatar,
  getVerifyUserEmail,
  resendVerifyUserEmail,
} = require("../../controllers/auth/userControllers");
const { upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", validation(registerSchema), ctrlWrapper(register));

router.post("/login", validation(loginSchema), ctrlWrapper(login));

router.get("/current", authenticate, ctrlWrapper(getCurrent));

router.post("/logout", authenticate, ctrlWrapper(logout));

router.patch("/", authenticate, ctrlWrapper(updateUserSubscription));

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

router.get("/verify/:verificationToken", ctrlWrapper(getVerifyUserEmail));

router.post(
  "/verify",
  validation(userVerifyJoiSchema),
  ctrlWrapper(resendVerifyUserEmail)
);

module.exports = router;
