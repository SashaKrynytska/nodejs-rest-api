const { Contact } = require("../../models");

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return res
      .status(400)
      .json({ status: `failure, no contacts with ${contactId} found!` });
  }

  res.json({ contact });
};

module.exports = getContactById;
