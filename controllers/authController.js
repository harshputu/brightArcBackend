const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
const { username, password } = req.body;

if (!username || !password)
return res.status(400).json({ error: "Missing fields" });

const user = await User.findOne({ username });
if (!user) return res.status(401).json({ error: "Invalid username" });

let match = false;

for (const hash of user.passwordHashes) {
const isMatch = await bcrypt.compare(password, hash);
if (isMatch) {
match = true;
break;
}
}

if (!match) return res.status(401).json({ error: "Invalid password" });

res.status(200).json({ message: "Login successful" });
};