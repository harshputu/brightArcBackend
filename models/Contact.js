const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String},
mobile: { type: String, required: true },
source: { type: String }, // How did you find us
message: {type : String},
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contact", contactSchema);