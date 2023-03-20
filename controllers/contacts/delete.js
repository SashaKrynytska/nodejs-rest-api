const { Contact } = require("../../models");

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  await Contact.findByIdAndDelete(contactId);
  res.json({ status: "success" });
};

module.exports = deleteContact;
