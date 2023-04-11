const { ctrlWrapper } = require("./catchAsyncWrapper");
const { validation } = require("./validation");
const { authenticate } = require("./authenticate");
const upload = require("./upload");

module.exports = {
  ctrlWrapper,
  validation,
  authenticate,
  upload,
};
