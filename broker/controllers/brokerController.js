// broker/controllers/brokerController.js
const axios = require('axios');
const config = require('../config'); // Import the configuration file

// Use the config values instead of hardcoded endpoints
const SERVICES = config.services; // Update config.js if other services runs elsewhere

// Helper to check health of a service
async function isServiceUp(serviceUrl) {
    try {
        const res = await axios.get(`${serviceUrl}/health`);
        return res.data.status === "OK";
    } catch (err) {
        return false;
    }
}

exports.forwardLogin = async (req, res) => {
    if (!(await isServiceUp(SERVICES.auth))) {
        return res.status(503).json({ message: "Auth service is down" });
    }
    try {
        const response = await axios.post(`${SERVICES.auth}/login`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error in auth service" });
    }
};

exports.forwardCourses = async (req, res) => {
    if (!(await isServiceUp(SERVICES.course))) {
        return res.status(503).json({ message: "Course service is down" });
    }
    try {
        const response = await axios.get(`${SERVICES.course}/courses`, { headers: req.headers });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error in course service" });
    }
};

exports.forwardEnroll = async (req, res) => {
    if (!(await isServiceUp(SERVICES.course))) {
      return res.status(503).json({ message: "Course service is down" });
    }
    try {
      const response = await axios.post(`${SERVICES.course}/enroll`, req.body, { headers: req.headers });
      res.json(response.data);
    } catch (err) {
      // If the error response exists, pass the status and message along.
      if (err.response && err.response.data && err.response.data.message) {
        return res.status(err.response.status).json({ message: err.response.data.message });
      }
      res.status(500).json({ message: "Error in course service" });
    }
  };

exports.forwardGrades = async (req, res) => {
    if (!(await isServiceUp(SERVICES.course))) {
        return res.status(503).json({ message: "Course service is down" });
    }
    try {
        const response = await axios.get(`${SERVICES.course}/grades`, { headers: req.headers });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error in course service" });
    }
};

exports.forwardUploadGrade = async (req, res) => {
    if (!(await isServiceUp(SERVICES.course))) {
        return res.status(503).json({ message: "Course service is down" });
    }
    try {
        const response = await axios.post(`${SERVICES.course}/upload-grade`, req.body, { headers: req.headers });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error in course service" });
    }
};

//forwardStudentDetails
exports.forwardStudentDetails = async (req, res) => {
    if (!(await isServiceUp(SERVICES.course))) {
      return res.status(503).json({ message: "Course service is down" });
    }
    try {
      const response = await axios.get(`${SERVICES.course}/student-details`, { headers: req.headers });
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ message: "Error in course service" });
    }
  };
