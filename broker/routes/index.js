// broker/routes/index.js
const express = require('express');
const router = express.Router();
const brokerController = require('../controllers/brokerController');

// Forward login, courses, enrollment, grades, and grade upload requests
router.post('/login', brokerController.forwardLogin);
router.get('/courses', brokerController.forwardCourses);
router.post('/enroll', brokerController.forwardEnroll);
router.get('/grades', brokerController.forwardGrades);
router.post('/upload-grade', brokerController.forwardUploadGrade);

// New route for student details
router.get('/student-details', brokerController.forwardStudentDetails);

module.exports = router;
