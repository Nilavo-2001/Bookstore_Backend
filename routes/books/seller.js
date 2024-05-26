const express = require('express');
const router = express.Router();
const upload = require('../../config/multerConfig');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const csv = require('csvtojson');
const authenticateSeller = require('../../middleware/sellerAuth');
const checkBookOwnership = require('../../middleware/checkOwnership');

// Seller CSV upload
router.post('/upload', authenticateSeller, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return apiResponse(res, false, 400, 'Failed to fullfill request', false, 'Did not recieved the csv file');
        }

        const jsonBookArray = await csv().fromFile(req.file.path);
        let books = [];
        jsonBookArray.forEach(book => {
            books.push({
                title: book.title,
                author: book.author,
                publishedDate: new Date(book.publishedDate),
                price: book.price,
                sellerId: req.user.id
            })
        });
        await prisma.book.createMany({
            data: books
        })
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err);
            }
        });


        return apiResponse(res, true, 200, 'Sucessfully uploaded the csv file', false);

    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
});




// Seller view, edit, delete their own books
router.get('/', authenticateSeller, async (req, res) => {
    try {
        const books = await prisma.book.findMany({ where: { sellerId: req.user.id } });
        return apiResponse(res, true, 200, 'All Seller Books Fetched Sucessfully', true, { books });
    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }

});

router.get('/:id', authenticateSeller, checkBookOwnership, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return apiResponse(res, true, 400, 'Failed to fullfill request', false, 'Missing Book Id');
        }

        const book = await prisma.book.findUnique({
            where: { id }, select: {
                title: true,
                author: true,
                publishedDate: true,
                price: true,
                seller: {
                    select: {
                        email: true,
                        name: true,
                    }
                }
            }
        },);

        if (!book) {
            return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'Book not found');
        }

        return apiResponse(res, true, 200, 'Sucessfully fetched the book details', true, { book });
    } catch (error) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
});

router.put('/:id', authenticateSeller, checkBookOwnership, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return apiResponse(res, true, 400, 'Failed to fullfill request', false, 'Missing Book Id');
        }


        const book = await prisma.book.findUnique({ where: { id } });

        if (!book) {
            return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'Book not found');
        }


        const updatedBook = await prisma.book.update({
            where: { id },
            data: req.body,
            select: {
                title: true,
                author: true,
                publishedDate: true,
                price: true,
                seller: {
                    select: {
                        email: true,
                        name: true,
                    }
                }
            }

        });

        return apiResponse(res, true, 200, 'Sucessfully fetched the book details', true, { updatedBook });
    } catch (err) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
});

router.delete('/:id', authenticateSeller, checkBookOwnership, async (req, res) => {

    try {
        const { id } = req.params;

        if (!id) {
            return apiResponse(res, true, 400, 'Failed to fullfill request', false, 'Missing Book Id');
        }

        const book = await prisma.book.findUnique({ where: { id } });

        if (!book) {
            return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'Book not found');
        }

        await prisma.book.delete({ where: { id } });
        return apiResponse(res, true, 200, 'Sucessfully fetched the book details', true, { book });
    } catch (err) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
});

module.exports = router