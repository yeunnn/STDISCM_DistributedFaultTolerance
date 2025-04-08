// course-service/models/Grade.js
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    username: String,
    courseId: String,
    grade: String
});

module.exports = mongoose.model('Grade', gradeSchema);
