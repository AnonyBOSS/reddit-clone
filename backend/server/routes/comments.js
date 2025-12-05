
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const auth = require('../middleware/authMiddleware');


router.post("/", auth, async (req, res) => {
  try {
    const { postId, body, parent } = req.body;
    if (!postId || !body) return res.status(400).json({ error: "Missing fields" });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      body,
      parent: parent || null
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    res.json(await comment.populate("author", "username"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/post/:postId", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit || '50')));
    const postId = req.params.postId;

    const total = await Comment.countDocuments({ post: postId });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const flat = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "username")
      .lean(); // Use lean for performance when manipulating plain objects

    // Build nested tree
    const byId = {};
    flat.forEach((c) => {
      // lean() returns plain objects, so we can modify them directly
      c.id = c._id;
      c.replies = [];
      byId[c._id] = c;
    });

    const roots = [];
    Object.values(byId).forEach((c) => {
      if (c.parent && byId[c.parent]) {
        byId[c.parent].replies.push(c);
      } else {
        roots.push(c);
      }
    });

    res.json({ comments: roots, page, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
