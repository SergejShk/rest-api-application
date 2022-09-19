const express = require("express");
const { asyncWrapper } = require("../../helpers/asyncWrapper");

const {
  listContactsController,
  addContactController,
  getContactByIdController,
  updateContactController,
  updateFavoriteController,
  removeContactController,
} = require("../../controllers/contactsControllers");

const router = express.Router();

router.get("/", asyncWrapper(listContactsController));

router.get("/:contactId", asyncWrapper(getContactByIdController));

router.post("/", asyncWrapper(addContactController));

router.delete("/:contactId", asyncWrapper(removeContactController));

router.put("/:contactId", asyncWrapper(updateContactController));

router.patch("/:contactId/favorite", asyncWrapper(updateFavoriteController));

module.exports = router;
