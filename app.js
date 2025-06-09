const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// API routes
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
// MongoDB connection mongodb+srv://root:root@brightarc.y8mgjme.mongodb.net/
mongoose
  .connect("mongodb://localhost:27017/tryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
