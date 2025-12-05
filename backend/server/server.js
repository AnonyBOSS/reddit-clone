
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { authLimiter, writeLimiter } = require('./middleware/rateLimiter');


const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/communities');
const postRoutes = require('./routes/posts');
const voteRoutes = require('./routes/votes');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const postsImageRoutes = require('./routes/postsImage');


const app = express();
app.use(cors());
app.use(express.json());



connectDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reddit_clone');



app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/communities', writeLimiter, communityRoutes);
app.use('/api/posts', writeLimiter, postRoutes);
app.use('/api/posts', voteRoutes);
app.use('/api/comments', writeLimiter, commentRoutes);
app.use('/api/users', writeLimiter, userRoutes);
app.use('/api/posts', writeLimiter, postsImageRoutes);


app.get('/', (req, res) => res.json({ message: 'API running' }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}    ` ));
