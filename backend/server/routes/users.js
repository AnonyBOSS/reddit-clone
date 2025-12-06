const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { writeLimiter } = require('../middleware/rateLimiter');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const User = require('../models/User');
const CommunityMember = require('../models/CommunityMember');
const Community = require('../models/Community');
const SavedPost = require('../models/SavedPost');
const Post = require('../models/Post');
const Comment = require('../models/Comment'); // New import

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

// POST /api/users/upload-avatar
router.post('/upload-avatar', auth, writeLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) return res.status(400).json({ success: false, data: null, error: 'No file uploaded' });
    const url = req.file.path;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: url }, { new: true }).select('-passwordHash');
    res.status(200).json({ success: true, data: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }, error: null });
  } catch (err) {
    // Multer file size error
    if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, data: null, error: 'File too large (max 5MB)' });
    if (err && err.message === 'Invalid file type') return res.status(400).json({ success: false, data: null, error: 'Invalid file type' });
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.status(200).json({ success: true, data: user, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// PATCH /api/users/me
router.patch('/me', auth, writeLimiter, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['bio', 'avatar', 'displayName'];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
    res.status(200).json({ success: true, data: user, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// GET /api/users/me/communities (auth required)
router.get('/me/communities', auth, async (req, res) => {
  try {
    const communityMemberships = await CommunityMember.find({ user: req.user._id }).populate('community');
    const communities = communityMemberships.map(membership => membership.community);
    res.status(200).json({ success: true, data: communities, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// GET /api/users/me/saved (auth required)
router.get('/me/saved', auth, async (req, res) => {
  try {
    const savedPosts = await SavedPost.find({ user: req.user._id })
      .populate({
        path: 'post',
        populate: [
          { path: 'author', select: 'username' },
          { path: 'community', select: 'name title' }
        ]
      });
    const posts = savedPosts.map(saved => saved.post);
    res.status(200).json({ success: true, data: posts, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// GET /api/users/:username (public profile)
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('username displayName bio avatar createdAt');
    if (!user) return res.status(404).json({ success: false, data: null, error: 'User not found' });

    // Get user's posts
    const userPosts = await Post.find({ author: user._id })
      .populate('author', 'username')
      .populate('community', 'name title')
      .sort({ createdAt: -1 })
      .limit(10); // Limit to 10 recent posts for profile display

    // Get user's comment count
    const commentCount = await Comment.countDocuments({ author: user._id });

    // Get communities the user is a member of
    const communityMemberships = await CommunityMember.find({ user: user._id }).populate('community', 'name title');
    const communitiesJoined = communityMemberships.map(membership => membership.community);

    const userData = {
      ...user.toObject(),
      posts: userPosts,
      commentCount: commentCount,
      communitiesJoined: communitiesJoined,
    };

    res.status(200).json({ success: true, data: userData, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

module.exports = router;

