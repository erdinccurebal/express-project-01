const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    createdDate: Date
});

module.exports = mongoose.model('users', userSchema);