
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiResponse = require('../utilities/apiResponse');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return apiResponse(res, false, 400, 'Failed to login', false, 'Ivalid Email or Password');
        }

        const token = jwt.sign({ email: user.email }, process.env.jwt_key, { expiresIn: '8h' });


        return apiResponse(res, false, 200, `${(!user.isSeller) ? ('Buyer') : ('Seller')} Loggedin Sucessfully`, true, { user: { ...user, password: null }, token });



    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 400, 'Failed to login', false, 'Internal Server Error');
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, role } = req.body;

        if (!name || !email || !password || !confirmpassword || !role) {
            return apiResponse(res, false, 400, 'Failed to Sign Up', false, 'Please Provide all the fields');

        }

        if (!['buyer', 'seller'].includes(role)) {
            return apiResponse(res, false, 400, 'Failed to Sign Up', false, 'Invalid role specified');
        }

        if (password != confirmpassword) {
            return apiResponse(res, false, 400, 'Failed to Sign Up', false, 'Password and confirm password are different');
        }

        const checkUser = await prisma.user.findUnique({ where: { email } });

        if (checkUser) {

            return apiResponse(res, false, 409, 'Failed to Sign Up', false, `${(role == 'buyer') ? ('Buyer') : ('Seller')} is already registered with the same Email`);

        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const isSeller = (role == 'seller');

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isSeller

            },
            select: {
                id: true,
                name: true,
                email: true,
                isSeller: true
            }
        });

        return apiResponse(res, true, 200, `${(role == 'buyer') ? ('Buyer') : ('Seller')} Registered Sucessfully`, true, { user });

    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 500, 'Failed to Sign up', false, 'Internal Server Error');
    }
}

module.exports = { login, signup };