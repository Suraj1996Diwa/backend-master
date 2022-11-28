const expressAsyncHandler = require("express-async-handler");
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

const Register = expressAsyncHandler(async (req,res)=>{
    const {username,password,role} = req.body
    if(!username || !password || !Array.isArray(role) || !removeListener.length){
        return res.status(400).json({ message: 'All fields are required' })
    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, roles }

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
    }
})
const Login = expressAsyncHandler(async (req,res)=>{
    const { username, password } = req.body
    if (!username || !password ) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const user = await User.findOne({ username })
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
            _id: user.id,
            name: user.name,
            email: user.email  
        })
        } else {
            res.status(400)
            throw new Error('Invalid credentials')
      }
})
router.post('/',Register)
router.post('/login',Login)

module.exports = router