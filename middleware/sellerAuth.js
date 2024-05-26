const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken');
const apiResponse = require('../utilities/apiResponse');

// Middleware to authorize Seller 
const authenticateSeller = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    //check if no token is provided
    if (!token) {
        return apiResponse(res, false, 401, 'Failed to Authorize', false, 'Auth Token not found');
    }
    try {
        // verifying the jwt token
        const { email } = jwt.verify(token, process.env.jwt_key);

        //fetching the user with the given email
        const checkUser = await prisma.user.findUnique({ where: { email } })

        // check if the seller does not exsist or if the user is not a seller
        if (!checkUser || !checkUser.isSeller) {
            return apiResponse(res, false, 401, 'Failed to Authorize', false, 'Seller does not exsist');
        }

        req.user = checkUser;
        next();
    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 500, 'Failed to Authorize', false, 'Internal Server Error');
    }
};

module.exports = authenticateSeller;