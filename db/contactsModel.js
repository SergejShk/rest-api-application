const mongoose = require("mongoose");

const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    unique: true,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 30,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    minlength: 5,
    maxlength: 25,
    unique: true,
    required: true,
  },
  favorite: { type: Boolean, default: false },
});

const Contacts = mongoose.model("Contacts", contactsSchema);

module.exports = {
  Contacts,
};
