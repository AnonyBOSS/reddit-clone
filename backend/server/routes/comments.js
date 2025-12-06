
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const CommentVote = require("../models/CommentVote");
const auth = require('../middleware/authMiddleware');
const { writeLimiter } = require('../middleware/rateLimiter');


router.post("/", auth, writeLimiter, validateObjectId('postId'), async (req, res) => {
  try {
    const { postId, body, parent } = req.body;
    if (!postId || !body) return res.status(400).json({ success: false, data: null, error: "Missing fields" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, data: null, error: "Post not found" });

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      body,
      parent: parent || null
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    const populatedComment = await comment.populate("author", "username");
    res.status(201).json({ success: true, data: populatedComment, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});


router.get("/post/:postId", validateObjectId('postId'), async (req, res) => {
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
    const commentIdsInPage = flat.map(c => c._id); // Get IDs of comments in the current page

    // Efficiently count direct replies for all comments on the page
    const replyCounts = await Comment.aggregate([
      { $match: { parent: { $in: commentIdsInPage } } },
      { $group: { _id: '$parent', count: { $sum: 1 } } }
    ]);

    const replyCountsMap = new Map(replyCounts.map(item => [item._id.toString(), item.count]));

    Object.values(byId).forEach((c) => {
      c.replyCount = replyCountsMap.get(c._id.toString()) || 0; // Set replyCount
      if (c.parent && byId[c.parent]) {
        byId[c.parent].replies.push(c);
      } else {
        roots.push(c);
      }
    });

    res.status(200).json({ success: true, data: { comments: roots, page, totalPages }, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

router.patch("/:id", auth, writeLimiter, validateObjectId('id'), async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, data: null, error: "Comment not found" });

    // Check if the user is the author
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, data: null, error: "Unauthorized: You are not the author of this comment" });
    }

    const updates = {};
    if (req.body.body !== undefined) {
      updates.body = req.body.body;
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, { new: true })
      .populate("author", "username");

    res.status(200).json({ success: true, data: updatedComment, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// DELETE /api/comments/:id (auth required)
router.delete("/:id", auth, writeLimiter, validateObjectId('id'), async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, data: null, error: "Comment not found" });

    // Check if the user is the author
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, data: null, error: "Unauthorized: You are not the author of this comment" });
    }

    // Delete related comment votes
    await CommentVote.deleteMany({ comment: commentId });

    // Decrement commentsCount in the parent post
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ success: true, data: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});


module.exports = router;
