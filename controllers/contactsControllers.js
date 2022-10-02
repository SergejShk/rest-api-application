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
  const { _id: owner } = req.user;

  const contacts = await getContacts(owner);

  return res.status(200).json({
    data: contacts,
  });
};

const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const contact = await getContactById(contactId, owner);

  return res.status(200).json({
    contact,
  });
};

const addContactController = async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  const { _id: owner } = req.user;

  const contact = await addContact({ name, email, phone, favorite }, owner);

  return res.status(201).json({ contact });
};

const updateContactController = async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const updatedContact = await updateContact(contactId, owner, {
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
  const { _id: owner } = req.user;

  if (!req.body) {
    throw new WrongParametersError("missing field favorite");
  }

  const contact = await updateStatusContact(contactId, owner, req.body);

  return res.status(200).json({ contact });
};

const removeContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  await removeContact(contactId, owner);

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
