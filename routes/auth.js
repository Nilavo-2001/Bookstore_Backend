const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth');

// Signup for Buyers and sellers
router.post('/signup', signup);

// Login for Buyers and sellers
router.post('/login', login);

module.exports = router;