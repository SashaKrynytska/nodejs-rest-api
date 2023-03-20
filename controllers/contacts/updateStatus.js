const { Contact } = require("../../models");

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

module.exports = updateStatusContact;
