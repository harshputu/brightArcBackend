const Blog = require("../models/Blog");
const slugify = require("slugify");
const Category = require("../models/Category");

exports.createBlog = async (req, res) => {
  try {
    let { category, ...rest } = req.body;
    console.log(category);
    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }
    // If category is not an ObjectId, look it up
    if (!/^[0-9a-fA-F]{24}$/.test(category)) {
      // Try by name, then by urlKey
      let categoryDoc = await Category.findOne({ categoryName: category.toLowerCase() });
      if (!categoryDoc) {
        categoryDoc = await Category.findOne({ urlKey: category.toLowerCase() });
      }
      if (!categoryDoc) {
        return res.status(400).json({ error: "Category does not exist." });
      }
      category = categoryDoc._id;
    }

    const blog = new Blog({ ...rest, category });
    await blog.save();

    const populatedBlog = await Blog.findById(blog._id).populate("category");
    res.status(201).json(populatedBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ postDate: -1 }).populate("category");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("category");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const categoryParam = req.params.categoryName.trim().toLowerCase();
    let categoryQuery = {};

    // Check if param is a valid ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(categoryParam)) {
      categoryQuery = { _id: categoryParam };
    } else if (categoryParam.startsWith("url:")) {
      // If prefixed with "url:", treat as urlKey
      categoryQuery = { urlKey: categoryParam.replace(/^url:/, "") };
    } else {
      // Otherwise, treat as categoryName
      categoryQuery = { categoryName: categoryParam };
    }

    const category = await Category.findOne(categoryQuery);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    const blogs = await Blog.find({ category: category._id }).populate("category");
    if (blogs.length === 0) {
      return res.status(404).json({ error: "No Blogs With this Category" });
    }
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs by category." });
  }
};

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
    if (req.body.category) {
      let categoryId = req.body.category;
      if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        let categoryDoc = await Category.findOne({ categoryName: categoryId.toLowerCase() });
        if (!categoryDoc) {
          categoryDoc = await Category.findOne({ urlKey: categoryId.toLowerCase() });
        }
        if (!categoryDoc) {
          return res.status(400).json({ error: "Category does not exist." });
        }
        categoryId = categoryDoc._id;
      }
      existingBlog.category = categoryId;
    }
    if (req.body.author) existingBlog.author = req.body.author;

    const updatedBlog = await existingBlog.save();

    const populatedBlog = await Blog.findById(updatedBlog._id).populate("category");
    res.json(populatedBlog);
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
