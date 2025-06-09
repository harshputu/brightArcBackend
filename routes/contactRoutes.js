const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/", contactController.submitContactForm);
router.get("/", contactController.getAllContacts);

module.exports = router;