const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const authenticateBuyer = require('../../middleware/buyerAuth');

const router = express.Router();


// User view all books
router.get('/', authenticateBuyer, async (req, res) => {
    const books = await prisma.book.findMany();
    res.json(books);
});

// User view specific book details
router.get('/:id', authenticateBuyer, async (req, res) => {
    const { id } = req.params;
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
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
});

module.exports = router