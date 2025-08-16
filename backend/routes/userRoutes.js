// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile } = require('../controller/userController');

// This route is protected by the authMiddleware
router.get('/profile', getProfile);

module.exports = router;