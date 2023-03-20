const express = require("express");
const router = express.Router();

const {
  getAll,
  addContact,
  getContactById,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { ctrlWrapper } = require("../../middlewares/catchAsyncWrapper");
const { validation } = require("../../middlewares/validation");
const { contactJoiSchema, favJoiSchema } = require("../../schemas/contacts");

router
  .route("/")
  .get(ctrlWrapper(getAll))
  .post(validation(contactJoiSchema), ctrlWrapper(addContact));

router
  .route("/:contactId")
  .get(ctrlWrapper(getContactById))
  .delete(ctrlWrapper(deleteContact))
  .put(validation(contactJoiSchema), ctrlWrapper(updateContact));

router
  .route("/:contactId/favorite")
  .patch(validation(favJoiSchema), ctrlWrapper(updateStatusContact));

module.exports = router;
