const mongoose = require('mongoose');

const CommentVoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true, index: true },
  value: { type: Number, required: true, enum: [1, -1] },
  createdAt: { type: Date, default: Date.now },
});

CommentVoteSchema.index({ user: 1, comment: 1 }, { unique: true });

module.exports = mongoose.model('CommentVote', CommentVoteSchema);
