const fs = require("fs/promises");
const { v4 } = require("uuid");
const path = require("path");

const contactsPath = path.resolve("models/contacts.json");

const listContacts = async () => {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(contactsList, null, 2);
    return contacts;
  } catch (error) {
    console.log(`Something went wrong. ${error.message}`);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const [contact] = await contacts.filter(
      (item) => String(item.id) === String(contactId)
    );
    return contact;
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const newContacts = contacts.filter(
      (contact) => String(contact.id) !== String(contactId)
    );

    console.log("Contact deleted successfully! New list of contacts: ");
    console.table(newContacts);

    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  } catch (error) {
    console.log(`Something went wrong. ${error.message}`);
  }
};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const newContact = { ...body, id: v4() };
    const contacts = await listContacts();
    const updatedContacts = [...contacts, newContact];
    await fs.writeFile(
      contactsPath,
      JSON.stringify(updatedContacts, null, 2),
      (error) => {
        if (error) console.log(error);
      }
    );

    console.log("New contact has been added!", newContact);
  } catch (error) {
    console.log(`Something went wrong. ${error.message}`);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const { name, email, phone } = body;
    const idx = contacts.findIndex(
      ({ id }) => String(id) === String(contactId)
    );
    if (idx === -1) {
      return null;
    }
    if (name) {
      contacts[idx].name = name;
    }
    if (email) {
      contacts[idx].email = email;
    }
    if (phone) {
      contacts[idx].phone = phone;
    }
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
    return contacts[idx];
  } catch (error) {
    console.log(`Something went wrong. ${error.message}`);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
