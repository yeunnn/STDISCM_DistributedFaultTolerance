// course-service/routes/index.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Health endpoint
router.get('/health', courseController.health);

// Endpoints that require JWT verification
router.get('/courses', courseController.getCourses);
router.post('/enroll', courseController.verifyToken, courseController.enroll);
router.get('/grades', courseController.verifyToken, courseController.getGrades);
router.post('/upload-grade', courseController.verifyToken, courseController.uploadGrade);

// New route for aggregated student details; protected by JWT
router.get('/student-details', courseController.verifyToken, courseController.getStudentDetails);

module.exports = router;
