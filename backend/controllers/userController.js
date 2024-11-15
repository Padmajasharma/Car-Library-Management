const User = require('../models/userModel');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET


const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).send({ "error": "User already exist" });
        }
        const secPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password:secPassword
        });

        newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' })

        res.cookie("auth-token", token, {
            path: "/",
            expires: new Date(Date.now() + (7 * 86400000)),
            secure: true,
            httpOnly: true,
            sameSite: "None",
        });

        res.status(200).send({ "token": token })
    } catch (err) {
        res.status(500).send({ "error": "Internal Server error" })

    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({ "error": "username is required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ "error": "Invalid username or username" });
        }

        const validPass = await bcryptjs.compare(password, user.password)
        if (!validPass) {
            return res.status(400).send({ "error": "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' })

        res.cookie("auth-token", token, {
            path: "/",
            expires: new Date(Date.now() + (7 * 86400000)),
            secure: true,
            httpOnly: true,
            sameSite: "None",
        });
        

        res.status(200).send({ "token": token })
    } catch (err) {
        res.status(500).send({ "error": "Internal Server error" })

    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        res.status(500).send("Internal Server error Occured");
    }
};

module.exports = {
    createUser,
    loginUser,
    getUser
}