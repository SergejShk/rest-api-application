const { WrongParametersError } = require("../helpers/errors");
const {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require("../services/contactsServices");

const listContactsController = async (req, res) => {
  const contacts = await getContacts();

  return res.status(200).json({
    data: contacts,
  });
};

const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  return res.status(200).json({
    contact,
  });
};

const addContactController = async (req, res) => {
  const { name, email, phone, favorite } = req.body;

  const contact = await addContact({ name, email, phone, favorite });

  return res.status(201).json({
    contact,
  });
};

const updateContactController = async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  const { contactId } = req.params;

  const updatedContact = await updateContact(contactId, {
    name,
    email,
    phone,
    favorite,
  });

  return res.status(200).json({
    updatedContact,
  });
};

const updateFavoriteController = async (req, res) => {
  const { contactId } = req.params;

  if (!req.body) {
    throw new WrongParametersError("missing field favorite");
  }

  const contact = await updateStatusContact(contactId, req.body);

  return res.status(200).json({ contact });
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;

  await removeContact(contactId);

  return res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  listContactsController,
  addContactController,
  getContactByIdController,
  updateContactController,
  updateFavoriteController,
  removeContactController,
};
