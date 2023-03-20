const { Contact } = require("../../models");

const addContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const contact = new Contact({ name, email, phone });

  await contact.save();
  res.status(200).json({ contact });
};

module.exports = addContact;
