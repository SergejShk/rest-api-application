const { Contacts } = require("../db/contactsModel");
const { NotFoundError, WrongParametersError } = require("../helpers/errors");

const getContacts = async () => {
  try {
    const contacts = await Contacts.find({});

    return contacts;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contacts.findById(contactId);

    if (!contact) {
      throw new NotFoundError("Not found");
    }

    return contact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const addContact = async ({ name, email, phone, favorite }) => {
  try {
    const contact = new Contacts({
      name,
      email,
      phone,
      favorite,
    });

    await contact.save();

    return contact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const updateContact = async (contactId, { name, email, phone, favorite }) => {
  try {
    const updatedContact = await Contacts.findByIdAndUpdate(contactId, {
      $set: { name, email, phone, favorite },
    });

    if (!updatedContact) {
      throw new NotFoundError("Not found");
    }

    return updatedContact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;

  try {
    const updatedContact = await Contacts.findByIdAndUpdate(contactId, {
      $set: { favorite },
    });

    if (!updatedContact) {
      throw new NotFoundError("Not found");
    }

    return updatedContact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const removeContact = async (contactId) => {
  try {
    const removedContact = await Contacts.findByIdAndRemove(contactId);

    if (!removedContact) {
      throw new NotFoundError("Not found");
    }

    return removedContact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
};
