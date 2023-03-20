const { Contact } = require("../../models");

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  await Contact.findByIdAndUpdate(contactId, { $set: { name, email, phone } });
  res.json({ status: "success" });
};

module.exports = updateContact;
