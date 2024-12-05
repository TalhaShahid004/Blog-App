const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    author: { type: Object }
});

module.exports = mongoose.model('User', userSchema);