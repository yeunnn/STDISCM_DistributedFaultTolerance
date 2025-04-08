// auth-service/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = "secretkey"; // Use a secure key in production

// Health check endpoint
exports.health = (req, res) => {
    res.json({ status: "OK" });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token });
        }
        res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
