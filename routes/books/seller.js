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
            throw new Error("Did not recieved the csv file");
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
        const { count } = await prisma.book.createMany({
            data: books
        })
        if (count <= 0) {
            throw new Error('Upload failed');
        }
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        return res.status(200).json({ "sucess": true, message: "Sucessfully uploaded the csv file" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "sucess": false, message: "Failed to upload the csv file", error: err.message });
    }
});




// Seller view, edit, delete their own books
router.get('/', authenticateSeller, async (req, res) => {
    try {
        const books = await prisma.book.findMany({ where: { sellerId: req.user.id } });
        res.status(200).json({ "sucess": true, message: "All Seller Books Fetched Sucessfully", data: { books } });
    } catch (error) {
        res.status(500).json({ "sucess": false, message: "Failed to fetch all Seller Books" });
    }

});

router.get('/:id', authenticateSeller, checkBookOwnership, async (req, res) => {
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

router.put('/:id', authenticateSeller, checkBookOwnership, async (req, res) => {
    const { id } = req.params;

    const updatedBook = await prisma.book.update({
        where: { id },
        data: req.body,
    });

    res.json(updatedBook);
});

router.delete('/:id', authenticateSeller, checkBookOwnership, async (req, res) => {

    const { id } = req.params;

    await prisma.book.delete({ where: { id } });
    res.json({ message: 'Book deleted successfully' });
});

module.exports = router