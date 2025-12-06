const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/authMiddleware');
const { writeLimiter } = require('../middleware/rateLimiter');
const Community = require('../models/Community');
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const SavedPost = require('../models/SavedPost');




// ... (rest of the file)

// POST /api/posts - Create a new post
router.post('/', auth, writeLimiter, async (req, res) => {
  try {
    const { title, body, communityName, url } = req.body;
    const author = req.user._id;

    if (!title || !communityName) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Title and communityName are required'
      });
    }

    // Find community by name
    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Community not found'
      });
    }

    // Create post
    const post = await Post.create({
      title,
      body: body || '',
      author,
      community: community._id,
      url: url || null,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('community', 'name title');

    return res.status(201).json({
      success: true,
      data: populatedPost,
      error: null
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message
    });
  }
});


router.get('/:id', validateObjectId('id'), async (req, res) => {

	try {

		const post = await Post.findById(req.params.id).populate('author', 'username').populate('community', 'name title');

		if (!post) return res.status(404).json({ success: false, data: null, error: 'Post not found' });

		res.status(200).json({ success: true, data: post, error: null });

	} catch (err) {

		res.status(500).json({ success: false, data: null, error: err.message });

	}

});



router.patch('/:id', auth, writeLimiter, validateObjectId('id'), async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, data: null, error: 'Post not found' });

    // Check if the user is the author
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, data: null, error: 'Unauthorized: You are not the author of this post' });
    }

    const updates = {};
    const allowedUpdates = ['title', 'body', 'url'];
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true })
      .populate('author', 'username')
      .populate('community', 'name title');

    res.status(200).json({ success: true, data: updatedPost, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// DELETE /api/posts/:id (auth required)

router.delete('/:id', auth, writeLimiter, validateObjectId('id'), async (req, res) => {

  try {

    const { id: postId } = req.params;

    const userId = req.user._id;



    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ success: false, data: null, error: 'Post not found' });



    // Check if the user is the author

    if (post.author.toString() !== userId.toString()) {

      return res.status(403).json({ success: false, data: null, error: 'Unauthorized: You are not the author of this post' });

    }



    // Delete related votes

    await Vote.deleteMany({ post: postId });



    // Delete related saved posts

    await SavedPost.deleteMany({ post: postId });



    // Find and delete related comments (cascade delete for comment votes will be in comments.js)

    // Using find and individual delete to potentially trigger pre-remove hooks if they exist in Comment model

    const commentsToDelete = await Comment.find({ post: postId });

    for (const comment of commentsToDelete) {

      // This might be redundant if Comment.deleteMany works correctly with hooks, but ensures individual processing

      await Comment.findByIdAndDelete(comment._id); 

    }

    // Fallback/direct delete if no hooks or for efficiency

    await Comment.deleteMany({ post: postId }); 



    // Delete the post itself

    await Post.findByIdAndDelete(postId);



    res.status(200).json({ success: true, data: null, error: null });

  } catch (err) {

    res.status(500).json({ success: false, data: null, error: err.message });

  }

});





// POST /api/posts/:id/save (auth required)

router.post('/:id/save', auth, writeLimiter, validateObjectId('id'), async (req, res) => {

  try {

    const { id: postId } = req.params;

    const userId = req.user._id;



    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ success: false, data: null, error: 'Post not found' });



    const existingSavedPost = await SavedPost.findOne({ user: userId, post: postId });

    if (existingSavedPost) {

      return res.status(200).json({ success: true, saved: true, error: null });

    }



    await SavedPost.create({ user: userId, post: postId });

    res.status(200).json({ success: true, saved: true, error: null });

  } catch (err) {

    res.status(500).json({ success: false, data: null, error: err.message });

  }

});



// DELETE /api/posts/:id/save (auth required)

router.delete('/:id/save', auth, writeLimiter, validateObjectId('id'), async (req, res) => {

  try {

    const { id: postId } = req.params;

    const userId = req.user._id;



    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ success: false, data: null, error: 'Post not found' });



    const deletedSavedPost = await SavedPost.findOneAndDelete({ user: userId, post: postId });



    if (!deletedSavedPost) {

      return res.status(200).json({ success: true, saved: false, error: null });

    }



    res.status(200).json({ success: true, saved: false, error: null });

  } catch (err) {

    res.status(500).json({ success: false, data: null, error: err.message });

  }

});



module.exports = router;
