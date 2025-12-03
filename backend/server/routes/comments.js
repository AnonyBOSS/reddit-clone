const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { protect } = require("../middleware/authMiddleware");

// GET comments for a post
router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "username")
    .sort({ createdAt: -1 });

  res.json(comments);
});

// CREATE a comment
router.post("/:postId", protect, async (req, res) => {
  const { text } = req.body;

  const comment = await Comment.create({
    text,
    post: req.params.postId,
    author: req.user._id,
  });

  res.status(201).json(comment);
});

module.exports = router;
