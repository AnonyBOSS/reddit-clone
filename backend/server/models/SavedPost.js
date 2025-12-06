const mongoose = require('mongoose');

const SavedPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('SavedPost', SavedPostSchema);
