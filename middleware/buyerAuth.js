const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Middleware to authenticate Seller 
const authenticateBuyer = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ sucess: "false", message: "Failed to Authorize Please login Once More", error: 'Unauthorized' });
    }
    try {
        const { email } = jwt.verify(token, process.env.jwt_key);
        const checkUser = await prisma.user.findUnique({ where: { email } })
        if (!checkUser || checkUser.isSeller) {
            return res.status(401).json({ sucess: "false", message: "Failed to Authorize, Buyer does not exsist", error: 'Unauthorized' });
        }
        req.user = checkUser;
        next();
    } catch (err) {
        res.status(401).json({ sucess: "false", message: "Failed to Authorize", error: err.message });
    }
};

module.exports = authenticateBuyer;