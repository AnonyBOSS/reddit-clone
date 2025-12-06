const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // New import for ObjectId validation
const Comment = require('../models/Comment');
const CommentVote = require('../models/CommentVote');
const auth = require('../middleware/authMiddleware');
const { writeLimiter } = require('../middleware/rateLimiter');

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, data: null, error: 'Invalid Comment ID' });
  }
  next();
};

// POST /api/comments/:id/vote
router.post('/:id/vote', auth, writeLimiter, validateObjectId, async (req, res) => { // Added validateObjectId
  try {
    const commentId = req.params.id;
    const { value } = req.body; // expected 1 or -1
    if (![1, -1].includes(value)) return res.status(400).json({ success: false, data: null, error: 'Invalid vote value' });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, data: null, error: 'Comment not found' });

    const existing = await CommentVote.findOne({ user: req.user._id, comment: commentId });
    let yourVote = value;

    if (!existing) {
      await CommentVote.create({ user: req.user._id, comment: commentId, value });
    } else if (existing.value === value) {
      await existing.deleteOne();
      yourVote = 0; // unvote
    } else {
      existing.value = value;
      await existing.save();
    }

    // Recompute score
    const agg = await CommentVote.aggregate([
      { $match: { comment: comment._id } },
      { $group: { _id: '$comment', score: { $sum: '$value' } } }
    ]);
    const newScore = (agg[0] && agg[0].score) || 0;
    comment.score = newScore;
    await comment.save();

    res.status(200).json({ success: true, data: { score: newScore, yourVote: yourVote }, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// DELETE /api/comments/:id/vote
router.delete('/:id/vote', auth, writeLimiter, validateObjectId, async (req, res) => { // Added validateObjectId
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, data: null, error: 'Comment not found' });

    await CommentVote.deleteOne({ user: req.user._id, comment: commentId });

    // Recompute score
    const agg = await CommentVote.aggregate([
      { $match: { comment: comment._id } },
      { $group: { _id: '$comment', score: { $sum: '$value' } } }
    ]);
    const newScore = (agg[0] && agg[0].score) || 0;
    comment.score = newScore;
    await comment.save();

    res.status(200).json({ success: true, data: { score: newScore, yourVote: 0 }, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

module.exports = router;
