const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
passwordHashes: { type: [String], required: true } // array of bcrypt hashes
});

module.exports = mongoose.model("User", userSchema);