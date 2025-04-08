// auth-service/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['student', 'faculty'] }
});

module.exports = mongoose.model('User', userSchema);
