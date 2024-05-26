const express = require('express');
const router = express.Router();
const upload = require('../../config/multerConfig');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const csv = require('csvtojson');
const authenticateSeller = require('../../middleware/sellerAuth');
const checkBookOwnership = require('../../middleware/checkOwnership');
const { csvUpload, fetchAllBooks, fetchSpecificBook, updateBook, deleteBook } = require('../../controllers/seller');

// Seller CSV upload
router.post('/upload', authenticateSeller, upload.single('file'), csvUpload);

// Seller view all books
router.get('/', authenticateSeller, fetchAllBooks);

// Seller view specific book
router.get('/:id', authenticateSeller, checkBookOwnership, fetchSpecificBook);

// Seller update specific book
router.put('/:id', authenticateSeller, checkBookOwnership, updateBook);

//Seller delete specific book
router.delete('/:id', authenticateSeller, checkBookOwnership, deleteBook);

module.exports = router