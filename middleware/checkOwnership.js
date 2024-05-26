const { PrismaClient } = require('@prisma/client');
const apiResponse = require('../utilities/apiResponse');
const prisma = new PrismaClient();

// middleware to check for book ownership
const checkBookOwnership = async (req, res, next) => {
    const bookId = req.params.id;
    const sellerId = req.user.id;

    try {
        // fetching a book with the given book id
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });

        //check if the book is not present in the database
        if (!book) {
            return apiResponse(res, false, 404, 'Failed to fullfill request', false, 'Book not found');

        }
        // check if the current seller is not the seller of book with the given book id
        if (book.sellerId !== sellerId) {
            return apiResponse(res, false, 404, 'Failed to fullfill request', false, 'You are not authorized to access or modify this book');
        }
        next();
    } catch (error) {
        return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'Internal server error');


    }
};

module.exports = checkBookOwnership;
