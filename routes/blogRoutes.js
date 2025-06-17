const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.post("/", blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:slug", blogController.getBlogBySlug);
router.put("/:slug", blogController.updateBlog);
router.delete("/:slug", blogController.deleteBlog);
router.get("/category/:category",blogController.getBlogByCategory);

router.post("/:slug/comments", blogController.addComment);
router.patch("/:slug/comments/:commentId/status", blogController.updateCommentStatus);
router.get("/:slug/comments", blogController.getCommentsForBlog);

router.post("/:slug/like", blogController.likeBlog);
router.post("/:slug/unlike", blogController.unlikeBlog);

module.exports = router;

