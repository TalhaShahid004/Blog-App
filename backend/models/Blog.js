const mongoose = require('mongoose');

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
    }],
    tags: [String]
});

module.exports = mongoose.model('Blog', blogSchema);