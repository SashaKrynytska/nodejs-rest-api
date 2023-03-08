const express = require("express");
const router = express.Router();
const path = require("path");
// const createError = require("http-errors");
const { NotFound } = require("http-errors");
const Joi = require("joi");

const contactsFunctionsPath = path.resolve("models/contacts.js");
const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "ua", "org"] },
    })
    .required(),
  phone: Joi.string().min(5).required(),
});

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require(contactsFunctionsPath);

router.get("/", async (req, res, next) => {
  try {
    const contactList = await listContacts();
    console.log("The contactList: ", contactList);

    res.status(200).json({
      status: "success",
      code: "200",
      data: {
        contactList,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const foundContact = await getContactById(contactId);
    if (!foundContact) {
      throw new NotFound(`Contact with id ${contactId} not found`);
      // throw createError(404, `Contact with id ${contactId} not found`);
      // const error = new Error(`Contact with id ${contactId} not found`);
      // error.status = 404;
      // throw error;
    }
    res.status(200).json({ foundContact });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const result = await addContact(req.body);
    res.status(201).json({
      message: "New contact has been created!",
      status: "success",
      code: "201",
      data: { result },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const foundContact = await removeContact(contactId);
    if (!foundContact) {
      throw new NotFound(`Contact with id ${contactId} not found`);
    }
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contact was deleted",
      data: { foundContact },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);
    if (!result) {
      throw new NotFound(`Contact with id ${contactId} not found`);
    }
    res.json({
      status: "success",
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
