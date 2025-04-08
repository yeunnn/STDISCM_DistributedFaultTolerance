// course-service/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: { type: String, unique: true },
    name: String
});

module.exports = mongoose.model('Course', courseSchema);
