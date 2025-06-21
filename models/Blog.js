const mongoose = require("mongoose");
const slugify = require("slugify");
const  categorySchema  = require("./Category");


const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  image: String,
  content: { type: String, required: true },
  author: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  postDate: { type: Date, default: Date.now },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  comments: [commentSchema],
});

blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model("Blog", blogSchema);
