const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    title: String,
    content: String,
    username: String,
    createdDate: Date
});

module.exports = mongoose.model('posts', postSchema);

