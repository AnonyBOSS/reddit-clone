const express = require("express");
const router = express.Router();
const Community = require("../models/Community");
const { protect } = require("../middleware/authMiddleware");

// GET all communities
router.get("/", async (req, res) => {
  const communities = await Community.find();
  res.json(communities);
});

// CREATE a community
router.post("/", protect, async (req, res) => {
  const { name, description } = req.body;

  try {
    const existing = await Community.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Community already exists" });

    const community = await Community.create({
      name,
      description,
      members: [req.user._id],
    });

    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// JOIN a community
router.post("/:id/join", protect, async (req, res) => {
  const community = await Community.findById(req.params.id);

  if (!community)
    return res.status(404).json({ message: "Community not found" });

  if (!community.members.includes(req.user._id)) {
    community.members.push(req.user._id);
    await community.save();
  }

  res.json(community);
});

module.exports = router;
