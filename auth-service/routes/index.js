// auth-service/routes/index.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/health', authController.health);
router.post('/login', authController.login);

module.exports = router;
