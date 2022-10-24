const { response } = require("express");
const express = require("express");
const UserModel = require("../models/UserModels");

const adminRouter = express.Router();

adminRouter.get("/check-admin", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const foundAdmin = await UserModel.find({ _id: userId, isAdmin: true });
    console.log(foundAdmin.map((x) => x.isAdmin));
    res.json(foundAdmin.map((x) => x.isAdmin));
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/get-all-users", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const foundAdmin = await UserModel.find({ _id: userId, isAdmin: true });
    if (foundAdmin) {
      const foundAllUsers = await UserModel.find({});
    //   console.log(foundAllUsers);
      res.send(foundAllUsers);
    } else {
      res.status(401).send("you are not authorized");
    }
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/delete-user", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const foundUser = await UserModel.deleteOne({ _id: userId })
    res.send(foundUser.acknowledged)
  } catch (error) {
      next(error)
  }
});

adminRouter.post("/assign-admin", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const foundUser = await UserModel.find({ _id: userId });
    const isAdminTrue = foundUser[0].isAdmin
    console.log(foundUser)
    // conditional statement to assign user as admin
    if(!isAdminTrue){
        const toTrue = await UserModel.findOneAndUpdate({ _id: userId }, { isAdmin: true})
        res.send(toTrue.isAdmin)
    }
    if(isAdminTrue){
        const toFalse = await UserModel.findOneAndUpdate({ _id: userId }, { isAdmin: false})
        res.send(toFalse.isAdmin)
    }
    // res.send(userToAdmin)
  } catch (error) {
      next(error)
  }
});
module.exports = adminRouter;
