// frontend/controllers/viewController.js
const axios = require('axios');
const config = require('../frontend-config');

const BROKER_URL = config.brokerUrl; // Update frontend-config.js if broker runs elsewhere

// Render the homepage view
exports.getHomepage = (req, res) => {
    res.render('homepage');
};

// Render login view
exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

// Process login: forward credentials to the broker's /api/login
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const response = await axios.post(`${BROKER_URL}/api/login`, { username, password });
        // On success, store the JWT and user info in session
        req.session.token = response.data.token;
        // Decode token payload (for simplicity, without extra verification)
        const payload = JSON.parse(Buffer.from(response.data.token.split('.')[1], 'base64').toString());
        req.session.user = { username: payload.username, role: payload.role };
        res.redirect('/dashboard');
    } catch (err) {
        let errorMessage = 'Authentication failed. ';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
        } else {
            errorMessage += 'Unable to connect to the authentication service.';
        }
        return res.render('login', { error: errorMessage });
    }
};

// Render dashboard view with optional error message
exports.getDashboard = (req, res) => {
    if (!req.session.user) return res.redirect('/');
    // Optionally, error message can be passed in if needed.
    res.render('dashboard', { user: req.session.user, error: null });
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

// Get courses: call broker's /api/courses
exports.getCourses = async (req, res) => {
    if (!req.session.token) return res.redirect('/');
    try {
        const response = await axios.get(`${BROKER_URL}/api/courses`, {
            headers: { 'Authorization': 'Bearer ' + req.session.token }
        });
        res.render('courses', { user: req.session.user, courses: response.data.courses, message: null });
    } catch (err) {
        let errorMessage = 'Error retrieving courses: ';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
        } else {
            errorMessage += 'Unable to connect to the course service.';
        }
        res.render('courses', { user: req.session.user, courses: [], message: errorMessage });
    }
};

// Enroll in a course (students)
exports.postEnroll = async (req, res) => {
    if (!req.session.token) return res.redirect('/');
    const { courseId } = req.body;
    try {
        const response = await axios.post(`${BROKER_URL}/api/enroll`, { courseId }, {
            headers: { 'Authorization': 'Bearer ' + req.session.token }
        });
        // After enrollment, re-fetch courses with a success message.
        const coursesResp = await axios.get(`${BROKER_URL}/api/courses`, {
            headers: { 'Authorization': 'Bearer ' + req.session.token }
        });
        res.render('courses', {
            user: req.session.user,
            courses: coursesResp.data.courses,
            message: response.data.message
        });
    } catch (err) {
        let errorMessage = 'Error enrolling in course: ';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
        } else {
            errorMessage += 'Unable to connect to the course service.';
        }
        res.render('courses', { user: req.session.user, courses: [], message: errorMessage });
    }
};

// Get grades for students
exports.getGrades = async (req, res) => {
    if (!req.session.token) return res.redirect('/');
    try {
        const response = await axios.get(`${BROKER_URL}/api/grades`, {
            headers: { 'Authorization': 'Bearer ' + req.session.token }
        });
        res.render('grades', { user: req.session.user, grades: response.data.grades, error: null });
    } catch (err) {
        let errorMessage = 'Error retrieving grades: ';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
        } else {
            errorMessage += 'Unable to connect to the course service.';
        }
        res.render('grades', { user: req.session.user, grades: [], error: errorMessage });
    }
};

// Upload grade (faculty)
exports.postUploadGrade = async (req, res) => {
    if (!req.session.token) return res.redirect('/');
    const { studentUsername, courseId, grade } = req.body;
    try {
        await axios.post(`${BROKER_URL}/api/upload-grade`, { studentUsername, courseId, grade }, {
            headers: { 'Authorization': 'Bearer ' + req.session.token }
        });
        res.redirect('/dashboard');
    } catch (err) {
        let errorMessage = 'Error uploading grade: ';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
        } else {
            errorMessage += 'Unable to connect to the course service.';
        }
        // Re-render the dashboard with the error message
        return res.render('dashboard', { user: req.session.user, error: errorMessage });
    }
};

// Get aggregated student details for faculty
exports.getStudentDetails = async (req, res) => {
    if (!req.session.token) return res.redirect('/');
    try {
        const response = await axios.get(`${BROKER_URL}/api/student-details`, {
            headers: { 'Authorization': 'Bearer ' + req.session.token }
        });
        res.render('student-details', {
            user: req.session.user,
            studentDetails: response.data.studentDetails,
            error: null
        });
    } catch (err) {
        let errorMessage = 'Error retrieving student details: ';
        if (err.response && err.response.data && err.response.data.message) {
            errorMessage += err.response.data.message;
        } else {
            errorMessage += 'Unable to connect to the course service.';
        }
        res.render('student-details', {
            user: req.session.user,
            studentDetails: [],
            error: errorMessage
        });
    }
};
