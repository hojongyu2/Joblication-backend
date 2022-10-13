const express = require('express');
const bcrypt = require('bcrypt');
const userRouter = express.Router();
const UserModel = require('../models/UserModels')

userRouter.post('/register-user', async (req, res, next) => {

    const {firstName, lastName, email, password, jobTitle} = req.body
    //console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 5)
    console.log(hashedPassword)

    const userDocument = new UserModel({
        firstName, lastName, email, hashedPassword, jobTitle
    })
    userDocument.save();

    res.json({ user : {
        id:userDocument._id,
        firstName, lastName, email, jobTitle,
    }})

})





module.exports = userRouter
