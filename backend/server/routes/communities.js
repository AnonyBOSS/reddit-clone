
const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const CommunityMember = require('../models/CommunityMember');
const auth = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth'); // New import
const { writeLimiter } = require('../middleware/rateLimiter');


router.post('/', auth, writeLimiter, async (req, res) => {
	try {
		const { name, title, description } = req.body;
		if (!name || !title) return res.status(400).json({ success: false, data: null, error: 'Missing fields' });

		const exists = await Community.findOne({ name });
		if (exists) return res.status(400).json({ success: false, data: null, error: 'Community already exists' });

		const community = await Community.create({ name, title, description, createdBy: req.user._id, membersCount: 1 });
		await CommunityMember.create({ user: req.user._id, community: community._id, role: 'owner' }); // Creator is the owner

		res.status(201).json({ success: true, data: community, error: null });
	} catch (err) {
		res.status(500).json({ success: false, data: null, error: err.message });
	}
});



router.get('/:name', optionalAuth, async (req, res) => {
	try {
		const community = await Community.findOne({ name: req.params.name });
		if (!community) return res.status(404).json({ success: false, data: null, error: 'Community not found' });

		let isMember = false;
		let memberRole = null;
		if (req.user) {
			const communityMember = await CommunityMember.findOne({ user: req.user._id, community: community._id });
			if (communityMember) {
				isMember = true;
				memberRole = communityMember.role;
			}
		}

		res.json({ success: true, data: { ...community.toObject(), isMember, memberRole }, error: null });
	} catch (err) {
		res.status(500).json({ success: false, data: null, error: err.message });
	}
});



router.get('/', async (req, res) => {
	try {
		const items = await Community.find().sort({ membersCount: -1 }).limit(50).select('name title description membersCount');
		res.json({ success: true, data: items, error: null });
	} catch (err) {
		res.status(500).json({ success: false, data: null, error: err.message });
	}
});


// Join community
router.post('/:name/join', auth, writeLimiter, async (req, res) => {
	try {
		const community = await Community.findOne({ name: req.params.name });
		if (!community) return res.status(404).json({ success: false, data: null, error: 'Community not found' });

		const existingMembership = await CommunityMember.findOne({ user: req.user._id, community: community._id });
		if (existingMembership) {
			return res.status(200).json({ success: true, joined: true, membersCount: community.membersCount, error: null });
		}

		await CommunityMember.create({ user: req.user._id, community: community._id, role: 'member' });
		community.membersCount++;
		await community.save();

		res.status(200).json({ success: true, joined: true, membersCount: community.membersCount, error: null });
	} catch (err) {
		res.status(500).json({ success: false, data: null, error: err.message });
	}
});

// Leave community
router.post('/:name/leave', auth, writeLimiter, async (req, res) => {
	try {
		const community = await Community.findOne({ name: req.params.name });
		if (!community) return res.status(404).json({ success: false, data: null, error: 'Community not found' });

		const deletedMembership = await CommunityMember.findOneAndDelete({ user: req.user._id, community: community._id });

		if (!deletedMembership) {
			return res.status(200).json({ success: true, joined: false, membersCount: community.membersCount, error: null });
		}

		community.membersCount--;
		await community.save();

		res.status(200).json({ success: true, joined: false, membersCount: community.membersCount, error: null });
	} catch (err) {
		res.status(500).json({ success: false, data: null, error: err.message });
	}
});


module.exports = router;