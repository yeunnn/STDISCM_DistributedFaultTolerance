// frontend/routes/index.js
const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// Homepage route: the new landing page with an overview and login button.
router.get('/', viewController.getHomepage);

// Login page
router.get('/login', viewController.getLogin);
router.post('/login', viewController.postLogin);

// Dashboard
router.get('/dashboard', viewController.getDashboard);
router.get('/logout', viewController.logout);

// Courses & enrollment
router.get('/courses', viewController.getCourses);
router.post('/enroll', viewController.postEnroll);

// Grades (for students)
router.get('/grades', viewController.getGrades);

// Grade upload (for faculty)
router.post('/upload-grade', viewController.postUploadGrade);

// New route for student aggregated details
router.get('/student-details', viewController.getStudentDetails);

module.exports = router;
