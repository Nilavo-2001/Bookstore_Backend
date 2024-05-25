const express = require('express');
const router = express.Router();

router.use('/buyer', require('./buyer'));
router.use('/seller', require('./seller'));
module.exports = router;