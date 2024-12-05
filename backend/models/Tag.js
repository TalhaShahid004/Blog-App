const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    value: { type: String, required: true }
});

module.exports = mongoose.model('Tag', tagSchema);