    // course-service/controllers/courseController.js
const jwt = require('jsonwebtoken');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Grade = require('../models/Grade');
const SECRET_KEY = "secretkey";

// Health endpoint
exports.health = (req, res) => {
    res.json({ status: "OK" });
};

// Middleware: Verify JWT token
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token verification failed' });
        req.user = decoded;
        next();
    });
};

// Get list of courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json({ courses });
    } catch (err) {
        res.status(500).json({ message: "Error fetching courses" });
    }
};

// Enroll in a course (students only)
exports.enroll = async (req, res) => {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll' });
    }
    const { courseId } = req.body;
    try {
      const course = await Course.findOne({ courseId });
      if (!course) {
        return res.status(400).json({ message: 'Course not found' });
      }
      const exists = await Enrollment.findOne({ username: req.user.username, courseId });
      if (exists) {
        // Return a specific error message if the student is already enrolled.
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }
      const enrollment = new Enrollment({ username: req.user.username, courseId });
      await enrollment.save();
      res.json({ message: `Enrolled in course ${courseId}` });
    } catch (err) {
      res.status(500).json({ message: "Error during enrollment" });
    }
  };

// Get grades (students only)
exports.getGrades = async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can view grades' });
    try {
        const grades = await Grade.find({ username: req.user.username });
        res.json({ grades });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving grades" });
    }
};

// Upload grade (faculty only)
exports.uploadGrade = async (req, res) => {
    if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Only faculty can upload grades' });
    const { studentUsername, courseId, grade } = req.body;
    try {
        // Check course exists
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(400).json({ message: 'Course not found' });
        const newGrade = new Grade({ username: studentUsername, courseId, grade });
        await newGrade.save();
        res.json({ message: `Uploaded grade for ${studentUsername} in course ${courseId}` });
    } catch (err) {
        res.status(500).json({ message: "Error uploading grade" });
    }
};

// New endpoint: getStudentDetails (faculty only)
exports.getStudentDetails = async (req, res) => {
    // Only allow faculty to access this endpoint
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Only faculty can access student details' });
    }
    try {
      const enrollments = await Enrollment.find({});
      const grades = await Grade.find({});
  
      // Group enrollments by username
      const enrollmentMap = {};
      enrollments.forEach((enrollment) => {
        if (!enrollmentMap[enrollment.username]) {
          enrollmentMap[enrollment.username] = [];
        }
        enrollmentMap[enrollment.username].push(enrollment.courseId);
      });
  
      // Group grades by username
      const gradesMap = {};
      grades.forEach((grade) => {
        if (!gradesMap[grade.username]) {
          gradesMap[grade.username] = [];
        }
        gradesMap[grade.username].push({ courseId: grade.courseId, grade: grade.grade });
      });
  
      // Create a combined list of student details based on all unique usernames found
      const studentDetails = [];
      const allUsernames = new Set([
        ...Object.keys(enrollmentMap),
        ...Object.keys(gradesMap)
      ]);
  
      allUsernames.forEach((username) => {
        studentDetails.push({
          username,
          enrollments: enrollmentMap[username] || [],
          grades: gradesMap[username] || []
        });
      });
  
      res.json({ studentDetails });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching student details" });
    }
  };