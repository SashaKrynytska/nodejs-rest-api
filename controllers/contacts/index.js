const getAll = require("./getAll");
const addContact = require("./add");
const getContactById = require("./getById");
const deleteContact = require("./delete");
const updateContact = require("./update");
const updateStatusContact = require("./updateStatus");

module.exports = {
  getAll,
  getContactById,
  deleteContact,
  addContact,
  updateContact,
  updateStatusContact,
};
