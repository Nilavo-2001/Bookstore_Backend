const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken');
// Middleware to authenticate Seller 
const authenticateSeller = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return apiResponse(res, false, 401, 'Failed to Authorize', false, 'Auth Token not found');
    }
    try {
        const { email } = jwt.verify(token, process.env.jwt_key);
        const checkUser = await prisma.user.findUnique({ where: { email } })
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