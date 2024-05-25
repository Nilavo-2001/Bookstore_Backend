const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkBookOwnership = async (req, res, next) => {
    const bookId = req.params.id;
    const sellerId = req.user.id;

    try {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (book.sellerId !== sellerId) {
            return res.status(403).json({ error: 'You are not authorized to access or modify this book' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkBookOwnership;
