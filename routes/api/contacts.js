const express = require("express");
const router = express.Router();

const {
  getAll,
  addContact,
  getContactById,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts/contactsControllers");
const { ctrlWrapper } = require("../../middlewares/catchAsyncWrapper");
const { validation } = require("../../middlewares/validation");
const { contactJoiSchema, favJoiSchema } = require("../../schemas/contacts");
const { authenticate } = require("../../middlewares/authenticate");

router
  .route("/")
  .get(authenticate, ctrlWrapper(getAll))
  .post(authenticate, validation(contactJoiSchema), ctrlWrapper(addContact));

router
  .route("/:contactId")
  .get(authenticate, ctrlWrapper(getContactById))
  .delete(authenticate, ctrlWrapper(deleteContact))
  .put(authenticate, validation(contactJoiSchema), ctrlWrapper(updateContact));

router
  .route("/:contactId/favorite")
  .patch(
    authenticate,
    validation(favJoiSchema),
    ctrlWrapper(updateStatusContact)
  );

module.exports = router;
