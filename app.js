const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// API routes
app.use("/api/blogs", blogRoutes);

// MongoDB connection
mongoose
  .connect("mongodb+srv://root:root@brightarc.y8mgjme.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
