const Blog = require("../models/Blog");
const slugify = require("slugify");
exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ postDate: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateBlog = async (req, res) => {
// try {
// const updated = await Blog.findOneAndUpdate(
// { slug: req.params.slug },
// req.body,
// { new: true, runValidators: true }
// );
// if (!updated) return res.status(404).json({ error: "Blog not found" });
// res.json(updated);
// } catch (err) {
// res.status(400).json({ error: err.message });
// }
// };

exports.updateBlog = async (req, res) => {
  try {
    const existingBlog = await Blog.findOne({ slug: req.params.slug });
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (req.body.title) {
      existingBlog.title = req.body.title;
      existingBlog.slug = slugify(req.body.title, {
        lower: true,
        strict: true,
      });
    }

    if (req.body.content) existingBlog.content = req.body.content;
    if (req.body.image) existingBlog.image = req.body.image;
    if (req.body.category) existingBlog.category = req.body.category;
    if (req.body.author) existingBlog.author = req.body.author;

    const updatedBlog = await existingBlog.save();

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Just In Case we need a separate API on the basis of Cateogries
// // GET /api/blogs?category=Technology
// exports.getBlogsByCategory = async (req, res) => {
// const { category } = req.query;
// const query = category ? { category } : {};

// try {
// const blogs = await Blog.find(query);
// res.json(blogs);
// } catch (err) {
// res.status(500).json({ error: err.message });
// }
// };

exports.addComment = async (req, res) => {
  const { slug } = req.params;
  const { user, text } = req.body;

  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    blog.comments.push({ user, text });
    blog.commentCount = blog.comments.length;
    await blog.save();

    res.json({ message: "Comment added and pending approval", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommentsForBlog = async (req, res) => {
  const { slug } = req.params;
  const { status } = req.query;

  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    let comments = blog.comments;

    if (status) {
      comments = comments.filter((comment) => comment.status === status);
    }

    res.json({ total: comments.length, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCommentStatus = async (req, res) => {
  const { slug, commentId } = req.params;
  const { status } = req.body; // "approved" or "rejected"

  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.status = status;
    await blog.save();

    res.json({ message: `Comment ${status}`, comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likeBlog = async (req, res) => {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { likeCount: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog liked", likeCount: blog.likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikeBlog = async (req, res) => {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    blog.likeCount = Math.max(0, blog.likeCount - 1);
    await blog.save();

    res.json({ message: "Blog unliked", likeCount: blog.likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
