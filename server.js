// First, install these dependencies:
// npm init -y
// npm install express mongoose cors dotenv

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    author: { type: Object }
});

const blogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    URL: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blogEntry: [{
        article: { type: String, required: true },
        publishDate: { type: Date, default: Date.now },
        comment: [{
            comment: { type: String, required: true },
            commentDate: { type: Date, default: Date.now },
            commentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }]
    }]
});

const tagSchema = new mongoose.Schema({
    value: { type: String, required: true }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Blog = mongoose.model('Blog', blogSchema);
const Tag = mongoose.model('Tag', tagSchema);

// Routes
// Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const query = req.query.author ? { author: req.query.author } : {};
        const blogs = await Blog.find(query)
            .populate('author')
            .populate('blogEntry.comment.commentBy');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/blogs', async (req, res) => {
    const blog = new Blog(req.body);
    try {
        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Comments
app.post('/api/blogs/:id/comments', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        blog.blogEntry[0].comment.push(req.body);
        const updatedBlog = await blog.save();
        res.status(201).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Tags
app.get('/api/blogs/tags/:tag', async (req, res) => {
    try {
        const blogs = await Blog.find({
            'tags': req.params.tag
        }).populate('author');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));