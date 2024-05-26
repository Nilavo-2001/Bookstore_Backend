const { PrismaClient } = require('@prisma/client');
const apiResponse = require('../utilities/apiResponse');
const prisma = new PrismaClient();

const checkBookOwnership = async (req, res, next) => {
    const bookId = req.params.id;
    const sellerId = req.user.id;

    try {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });
        if (!book) {
            return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'Book not found');

        }
        if (book.sellerId !== sellerId) {
            return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'You are not authorized to access or modify this book');
        }
        next();
    } catch (error) {
        return apiResponse(res, true, 404, 'Failed to fullfill request', false, 'Internal server error');


    }
};

module.exports = checkBookOwnership;
