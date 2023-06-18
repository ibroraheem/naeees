const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findOne({ username })
        if (admin) return res.status(400).json({ msg: 'The username already exists.' })
        if (password.length < 6) return res.status(400).json({ msg: 'Password is at least 6 characters long.' })
        const passwordHash = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({
            username, password: passwordHash
        })
        await newAdmin.save()
        const token = jwt.sign({ id: newAdmin._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        res.status(201).json({ message: 'Registration Success!', username: newAdmin.username, token })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const login = async (res, req) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findOne({ username })
        if (!admin) return res.status(400).json({ msg: 'User does not exist.' })
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect password.' })
        const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        res.status(200).json({ message: 'Login Success!', username: admin.username, token })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

module.exports = { register, login }
