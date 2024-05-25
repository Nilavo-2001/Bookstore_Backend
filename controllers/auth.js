
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid Email or Password');
        }

        const token = jwt.sign({ email: user.email }, process.env.jwt_key, { expiresIn: '8h' });

        res.status(200).json({ "sucess": true, message: `${(!user.isSeller) ? ('Buyer') : ('Seller')} Loggedin Sucessfully`, data: { user: { ...user, password: null }, token } });

    } catch (err) {
        console.log(err);
        res.status(400).json({ "sucess": false, message: 'Failed to Login', error: err.message });
    }
}

const signup = async (req, res) => {
    try {
        const { name, email, password, confirmpassword, role } = req.body;

        if (!name || !email || !password || !confirmpassword || !role) {
            throw new Error('Please Provide all the fields')
        }

        if (!['buyer', 'seller'].includes(role)) {
            throw new Error('Invalid role specified');
        }

        if (password != confirmpassword) {
            throw new Error("Password and confirm password are different");
        }

        const checkUser = await prisma.user.findUnique({ where: { email } });

        if (checkUser) {
            throw new Error(`${(role == 'buyer') ? ('Buyer') : ('Seller')} is already registered with the same Email`);
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
                name: true,
                email: true,
                isSeller: true
            }
        });
        res.status(200).json({ "sucess": true, message: `${(role == 'buyer') ? ('Buyer') : ('Seller')} Registered Sucessfully`, data: { user } });
    } catch (err) {
        //console.log(err);
        res.status(400).json({ "sucess": false, message: 'Failed to Regsiter', error: err.message });
    }
}

module.exports = { login, signup };