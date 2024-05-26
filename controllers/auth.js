
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const apiResponse = require('../utilities/apiResponse');


// login for both seller and buyer
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // fetching the user from the database with the given email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // check if the user is not present in database and the given password does not match with the password in the database
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return apiResponse(res, false, 400, 'Failed to login', false, 'Ivalid Email or Password');
        }

        //creating a jwt token with user email that is valid for 8hrs
        const token = jwt.sign({ email: user.email }, process.env.jwt_key, { expiresIn: '8h' });

        //returning the user data with password updated as null along with the jwt token for security
        return apiResponse(res, true, 200, `${(!user.isSeller) ? ('Buyer') : ('Seller')} Loggedin Sucessfully`, true, { user: { ...user, password: null }, token });



    } catch (err) {
        console.log(err);
        return apiResponse(res, false, 500, 'Failed to login', false, 'Internal Server Error');
    }
}

//signup for both seller and buyer
const signup = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, role } = req.body;

        // check if any one of the user field is not provided
        if (!name || !email || !password || !confirmpassword || !role) {
            return apiResponse(res, false, 400, 'Failed to Sign Up', false, 'Not all of the fields are provided');

        }
        //check if the role provided is invalid
        if (!['buyer', 'seller'].includes(role)) {
            return apiResponse(res, false, 400, 'Failed to Sign Up', false, 'Invalid role specified');
        }
        // check if the password is not equal to confirm password
        if (password != confirmpassword) {
            return apiResponse(res, false, 400, 'Failed to Sign Up', false, 'Password and confirm password are different');
        }

        // fetching the user from the database with the given email
        const checkUser = await prisma.user.findUnique({ where: { email } });

        //check if a user is already present with the same email
        if (checkUser) {
            return apiResponse(res, false, 409, 'Failed to Sign Up', false, `Someone has already registered with the same Email`);
        }

        //generating a hash for the password and storing that instead of storing the actual password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const isSeller = (role == 'seller');

        // inserting a new user in the database
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