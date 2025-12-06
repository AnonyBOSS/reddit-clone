const mongoose = require('mongoose');

const CommunityMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['member', 'moderator', 'owner'],
    default: 'member',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CommunityMemberSchema.index({ user: 1, community: 1 }, { unique: true });

module.exports = mongoose.model('CommunityMember', CommunityMemberSchema);
