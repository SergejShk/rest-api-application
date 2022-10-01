const { Contacts } = require("../db/contactsModel");
const { NotFoundError, WrongParametersError } = require("../helpers/errors");

const getContacts = async (owner) => {
  try {
    const contacts = await Contacts.find({ owner });

    return contacts;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const getContactById = async (contactId, owner) => {
  try {
    const contact = await Contacts.findOne({
      _id: contactId,
      owner,
    });

    if (!contact) {
      throw new NotFoundError("Not found");
    }

    return contact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const addContact = async ({ name, email, phone, favorite }, owner) => {
  try {
    const contact = new Contacts({
      name,
      email,
      phone,
      favorite,
      owner,
    });

    await contact.save();

    return contact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const updateContact = async (
  contactId,
  owner,
  { name, email, phone, favorite }
) => {
  console.log(contactId);
  console.log(owner);
  try {
    const updatedContact = await Contacts.findOneAndUpdate(
      { _id: contactId, owner },
      {
        $set: { name, email, phone, favorite },
      }
    );

    if (!updatedContact) {
      throw new NotFoundError("Not found");
    }

    return updatedContact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const updateStatusContact = async (contactId, owner, body) => {
  const { favorite } = body;

  try {
    const updatedContact = await Contacts.findOneAndUpdate(
      { _id: contactId, owner },
      { $set: { favorite } }
    );

    if (!updatedContact) {
      throw new NotFoundError("Not found");
    }

    return updatedContact;
  } catch (error) {
    throw new WrongParametersError(error.message);
  }
};

const removeContact = async (contactId, owner) => {
  try {
    const removedContact = await Contacts.findOneAndRemove({
      _id: contactId,
      owner,
    });

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
