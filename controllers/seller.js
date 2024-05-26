const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const csv = require('csvtojson');
const apiResponse = require('../utilities/apiResponse');


// to upload books csv
const csvUpload = async (req, res) => {
    try {
        //check if the csv file is missing
        if (!req.file) {
            return apiResponse(res, false, 400, 'Failed to fullfill request', false, 'Did not recieved the csv file');
        }

        // converting the csv file to a jsonarray
        const jsonBookArray = await csv().fromFile(req.file.path);

        // converting the json array to javascript array of objects
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

        // inserting all the books into the database
        await prisma.book.createMany({
            data: books
        })

        // deleting the csv file after uploading its data to the database
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
}

// to fetch all the books of the current seller
const fetchAllBooks = async (req, res) => {
    try {
        // fetching all the books of the current seller
        const books = await prisma.book.findMany({ where: { sellerId: req.user.id } });
        return apiResponse(res, true, 200, 'All Seller Books Fetched Sucessfully', true, { books });
    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }

}

// to fetch a specific book of the current seller
const fetchSpecificBook = async (req, res) => {
    try {
        const { id } = req.params;

        //check if the book id is missing
        if (!id) {
            return apiResponse(res, false, 400, 'Failed to fullfill request', false, 'Missing Book Id');
        }

        //fetching the seller book with the given book id
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

        return apiResponse(res, true, 200, 'Sucessfully fetched the book details', true, { book });
    } catch (error) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
}

// to update a specific book
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        //check if the book id or the req body is missing
        if (!id || !req.body) {
            return apiResponse(res, false, 400, 'Failed to fullfill request', false, 'Missing Book Id or req Body');
        }

        // updating the book
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

        return apiResponse(res, true, 200, 'Sucessfully updated the book', true, { updatedBook });
    } catch (err) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
}

// to delete a specific book
const deleteBook = async (req, res) => {

    try {
        const { id } = req.params;

        //check if the book id is missing
        if (!id) {
            return apiResponse(res, false, 400, 'Failed to fullfill request', false, 'Missing Book Id');
        }

        //deleting the book from the database
        await prisma.book.delete({ where: { id } });

        return apiResponse(res, true, 200, 'Sucessfully deleted the book', false);
    } catch (err) {
        return apiResponse(res, false, 500, 'Failed to fullfill request', false, 'Internal Server Error');
    }
}

module.exports = { csvUpload, fetchAllBooks, fetchSpecificBook, updateBook, deleteBook }