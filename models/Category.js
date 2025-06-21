const mongoose = require("mongoose");

const categorySchema  = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true , lowercase: true },
  activeStatus: { type: String, enum: ["active", "inactive"], default: "active" },
  urlKey: { type: String, unique: true }
});

categorySchema.pre("save", function(next) {
  if (this.isModified("categoryName")) {
    this.urlKey = this.categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, "");    // Trim hyphens from start/end
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);