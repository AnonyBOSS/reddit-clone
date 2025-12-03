const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Community = require("../models/Community");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const connectDB = require("../config/db");

connectDB();

const seedData = async () => {
  try {
    console.log("Clearing old data...");
    await User.deleteMany();
    await Community.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Vote.deleteMany();

    console.log("Creating sample user...");
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    console.log("Creating sample community...");
    const community = await Community.create({
      name: "webdev",
      description: "Web Development Community",
      members: [user._id],
    });

    console.log("Creating sample post...");
    const post = await Post.create({
      title: "Hello Reddit Clone!",
      body: "This is our first post 🎉",
      community: community._id,
      author: user._id,
    });

    console.log("Adding sample comment...");
    await Comment.create({
      text: "Nice project!",
      post: post._id,
      author: user._id,
    });

    console.log("Database seeded successfully 🎉");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
