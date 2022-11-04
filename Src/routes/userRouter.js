const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModels");
const jwt = require("jsonwebtoken");

const cleanUser = (userDocument) => {
  return {
    id: userDocument._id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    jobTitle: userDocument.jobTitle,
    isAdmin: userDocument.isAdmin,
  };
};

const getToken = (userId) => {
  return jwt.sign({ userId, iat: Date.now() }, process.env.AUTH_SECRET_KEY);
};

const userRouter = express.Router();

userRouter.get("/sign-out", (req, res, next) => {
  res.clearCookie("session_token");
  res.send("Signed out successfully");
});

userRouter.post("/register-user", async (req, res, next) => {
  const { firstName, lastName, email, password, jobTitle } = req.body;
  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    const existUser = await UserModel.findOne({ email: email })
    if(existUser){
     return res.json({result: false, message: "User exist"}).status(401)
    }
    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      hashedPassword,
      jobTitle,
      isAdmin: false,
    });
    userDocument.save();

    // const token = getToken(userDocument._id);
    // res.cookie("session_token", token, { httpOnly: true, secure: false });
    res.json({ user: cleanUser(userDocument) });
  } catch (error) {
    next(error)
  }
});

userRouter.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body.credentials;

  try {
    const foundUser = await UserModel.findOne({ email: email });
    if (!foundUser) {
      return res
        .json({
          success: false,
          message: "Your email or password was incorrect",
        })
        .status(401);
    }
    const passwrodMatch = await bcrypt.compare(
      password,
      foundUser.hashedPassword
    );
    if (!passwrodMatch) {
      return res
        .json({
          success: false,
          message: "Your Email or password was incorrect",
        })
        .status(401);
    }

    const token = getToken(foundUser._id);
    res.cookie("session_token", token, { httpOnly: true, secure: false });
    res.json({ user: cleanUser(foundUser) });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/edit-user", async (req, res, next) => {
  try {
    const { firstName, lastName, email, oldPassword, newPassword, matchPassword, jobTitle } = req.body;
    const userId = req.user.id
    const foundUser = await UserModel.find({ _id: userId });
    const storedPassword = foundUser[0].hashedPassword
    if(await bcrypt.compare(oldPassword, foundUser[0].hashedPassword)) {
      const updateUser = await UserModel.findOneAndUpdate({ _id: userId }, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        hashedPassword: await bcrypt.hash(newPassword, 5),
        jobTitle: jobTitle
      })
      const foundUpdatedUser = await UserModel.find({_id: userId });
      res.json({success: true, message: foundUpdatedUser[0]})
    }else {
      res.json({success: false, message: "Password does not match"})
    }
  } catch (error) {
    next(error); 
  }
});

module.exports = userRouter;
