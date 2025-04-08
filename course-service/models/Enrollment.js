// course-service/models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    username: String,
    courseId: String
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
