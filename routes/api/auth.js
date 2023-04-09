const express = require("express");
const { validation } = require("../../middlewares/validation");
const { authenticate } = require("../../middlewares/authenticate");
const { registerSchema, loginSchema } = require("../../schemas/users");
const { ctrlWrapper } = require("../../middlewares/catchAsyncWrapper");
const {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
} = require("../../controllers/auth/userControllers");

const router = express.Router();

router.post("/register", validation(registerSchema), ctrlWrapper(register));

router.post("/login", validation(loginSchema), ctrlWrapper(login));

router.get("/current", authenticate, ctrlWrapper(getCurrent));

router.post("/logout", authenticate, ctrlWrapper(logout));

router.route("/").patch(authenticate, ctrlWrapper(updateUserSubscription));

module.exports = router;
