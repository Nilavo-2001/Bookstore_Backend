const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const authenticateBuyer = require('../../middleware/buyerAuth');
const apiResponse = require('../../utilities/apiResponse');
const { fetchAllBooks } = require('../../controllers/buyer');
const { fetchSpecificBook } = require('../../controllers/buyer');

const router = express.Router();


// Buyer view all books
router.get('/', authenticateBuyer, fetchAllBooks);

// User view specific book details
router.get('/:id', authenticateBuyer, fetchSpecificBook);

module.exports = router