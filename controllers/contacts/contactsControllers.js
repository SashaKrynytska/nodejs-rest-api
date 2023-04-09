const { HttpError } = require("../../helpers");
const { Contact } = require("../../models");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, { skip, limit }).populate(
    "owner",
    "name email"
  );
  res.status(200).json({ allContacts });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw HttpError(404);
  }

  res.json({ contact });
};

const addContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(200).json(newContact);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  await Contact.findByIdAndUpdate(contactId, { $set: { name, email, phone } });
  res.json({ status: "success" });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  await Contact.findByIdAndDelete(contactId);
  res.json({ status: "success" });
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;

  const { favorite } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );

  if (!contact) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  res.status(200).json({ contact });
};

module.exports = {
  getAll,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  updateStatusContact,
};
