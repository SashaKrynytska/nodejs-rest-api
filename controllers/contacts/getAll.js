const { Contact } = require("../../models");

const getAll = async (_, res) => {
  const allContacts = await Contact.find({});
  res.status(200).json({ allContacts });
};

module.exports = getAll;
