const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Blog = require('./models/Blog');
const Tag = require('./models/Tag');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for initialization'))
.catch(err => console.error('MongoDB connection error:', err));

async function initializeDatabase() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Blog.deleteMany({});
        await Tag.deleteMany({});

        console.log('Cleared existing data');

        // Create sample users
        const users = await User.insertMany([
            {
                name: "John Doe",
                emailAddress: "john@example.com",
                author: { bio: "Tech enthusiast and blogger" }
            },
            {
                name: "Jane Smith",
                emailAddress: "jane@example.com",
                author: { bio: "Professional writer and editor" }
            },
            {
                name: "Bob Wilson",
                emailAddress: "bob@example.com",
                author: { bio: "Travel blogger and photographer" }
            }
        ]);

        console.log('Created sample users');

        // Create sample blogs
        await Blog.insertMany([
            {
                name: "Tech Trends 2024",
                URL: "https://blog.example.com/tech-trends",
                author: users[0]._id,
                blogEntry: [{
                    article: "Latest trends in technology...",
                    publishDate: new Date(),
                    comment: [{
                        comment: "Great insights!",
                        commentDate: new Date(),
                        commentBy: users[1]._id
                    }]
                }],
                tags: ["technology", "trends"]
            },
            {
                name: "Travel Adventures",
                URL: "https://blog.example.com/travel",
                author: users[2]._id,
                blogEntry: [{
                    article: "My journey through Europe...",
                    publishDate: new Date(),
                    comment: [{
                        comment: "Awesome travel tips!",
                        commentDate: new Date(),
                        commentBy: users[0]._id
                    }]
                }],
                tags: ["travel", "adventure"]
            }
        ]);

        console.log('Created sample blogs');
        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await mongoose.connection.close();
    }
}

initializeDatabase();