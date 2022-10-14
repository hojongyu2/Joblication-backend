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
  //console.log(req.body)
  const hashedPassword = await bcrypt.hash(password, 5);
  console.log(hashedPassword);

  try {
    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      hashedPassword,
      jobTitle,
    });
    userDocument.save();

    // const token = getToken(userDocument._id);
    // res.cookie("session_token", token, { httpOnly: true, secure: false });
    res.json({ user: cleanUser(userDocument) });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body.credentials;

  try {
    const foundUser = await UserModel.findOne({ email: email });
    if (!foundUser) {
      return res.status(401).send("user not found");
    }
    const passwrodMatch = await bcrypt.compare(
      password,
      foundUser.hashedPassword
    );
    // console.log(passwrodMatch)
    if (!passwrodMatch) {
      return res.status(401).send("wrong password");
    }

    const token = getToken(foundUser._id);
    res.cookie("session_token", token, { httpOnly: true, secure: false });
    res.json({ user: cleanUser(foundUser) });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
