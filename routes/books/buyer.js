const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const authenticateBuyer = require('../../middleware/buyerAuth');
const apiResponse = require('../../utilities/apiResponse');

const router = express.Router();


// User view all books
router.get('/', authenticateBuyer, async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        return apiResponse(res, true, 200, 'Sucessfully fetched all Books', true, { books });
    } catch (error) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
});

// User view specific book details
router.get('/:id', authenticateBuyer, async (req, res) => {
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

    res.json(book);
});

module.exports = router