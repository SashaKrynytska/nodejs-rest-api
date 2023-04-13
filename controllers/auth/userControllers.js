const { v4 } = require("uuid");
const { User } = require("../../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const sendVerificationEmail = require("../../helpers/sendEmailService");
const dotenv = require("dotenv");
dotenv.config();

const { HttpError } = require("../../helpers");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = v4();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await newUser.save();

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
      verificationToken,
    },
  });
};

const getVerifyUserEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({ message: "Verification successful" });
};

const resendVerifyUserEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new HttpError(400, "Missing required field email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  await sendVerificationEmail(email, user.verificationToken);
  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verify) {
    throw new HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24d" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "No Content" });
};

const updateUserSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const subscriptionVar = ["starter", "pro", "business"];

  if (!subscriptionVar) {
    return res.status(400).json({ message: "missing field subscription" });
  }

  const updatedSubscriptionUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  res.status(200).json(updatedSubscriptionUser);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, 250).quality(60).write(tempUpload);
    })
    .catch((err) => {
      throw new HttpError(400, err.message);
    });

  const filename = `${_id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw new HttpError(401);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateUserSubscription,
  updateAvatar,
  getVerifyUserEmail,
  resendVerifyUserEmail,
};
