const { PrismaClient } = require('@prisma/client');
const apiResponse = require('../utilities/apiResponse');
const prisma = new PrismaClient();

// fetch all books from the database
const fetchAllBooks = async (req, res) => {
    try {
        // fetching all books from the databse
        const books = await prisma.book.findMany();
        return apiResponse(res, true, 200, 'Sucessfully fetched all Books', true, { books });
    } catch (error) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
}

// fetch a specific book from the database
const fetchSpecificBook = async (req, res) => {
    try {
        const { id } = req.params;

        //check if the book id is missing
        if (!id) {
            return apiResponse(res, false, 400, 'Failed to fullfill request', false, 'Missing Book Id');
        }

        // fetching the book details from the database
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

        // check if there is no book in the database with the given book id
        if (!book) {
            return apiResponse(res, false, 404, 'Failed to fullfill request', false, 'Book not found');
        }
        return apiResponse(res, true, 200, 'Sucessfully fetched the book details', true, { book });

    } catch (error) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
}


module.exports = { fetchAllBooks, fetchSpecificBook }

