const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const [contact] = contacts.filter(
      (contact) => contact.id === String(contactId)
    );

    if (!contact) {
      throw new Error("No contact found with the given id");
    }

    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === String(contactId)
    );

    if (contactIndex === -1) {
      throw new Error("No contact found");
    }

    const [removedContact] = contacts.splice(contactIndex, 1);

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    contacts.push(body);

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return body;
  } catch (error) {
    console.log(error.message);
  }
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;

  try {
    const contacts = await listContacts();

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === String(contactId)
    );

    if (contactIndex === -1) {
      throw new Error("No contact found");
    }

    contacts[contactIndex] = { contactId, name, email, phone };

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[contactIndex];
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
