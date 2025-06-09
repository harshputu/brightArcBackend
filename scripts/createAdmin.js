const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

mongoose.connect("mongodb://127.0.0.1:27017/tryDB", {
useNewUrlParser: true,
useUnifiedTopology: true
});

const passwords = [
"silverMaple#197",
"windyFalcon@302",
"lavaTiger!899",
"frostWolf$456"
];

(async () => {
const passwordHashes = await Promise.all(passwords.map(pwd => bcrypt.hash(pwd, 10)));

const admin = new User({
username: "admin",
passwordHashes
});

await admin.save();
console.log("Admin created");
mongoose.disconnect();
})();