require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const port = process.env.PORT;
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserModel = require('./models/UserModels');
const jwt = require('jsonwebtoken');
const searchRouter = require('./routes/searchRouter');
const joblicationRouter = require("./routes/joblicationRouter");
const noteRouter = require("./routes/noteRouter");
const adminRouter = require("./routes/adminRouter")
const app = express();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => console.log("Connected to mongo db successfully"))
  .catch(() => console.log("unable to connect to mongodb"));

//cors
app.use(cors({
    credentials:true,
    origin: process.env.CORS_ORIGIN
}));
// app.use(cors)

app.use(cookieParser());

//parsing JSON to req.body
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    const { session_token: sessionToken } = req.cookies;

    if (!sessionToken) {
      return next();
    }
    const { userId, iat } = jwt.verify(
      sessionToken,
      process.env.AUTH_SECRET_KEY
    );
    if (iat < Date.now() - 30 * 24 * 60 * 60 * 1000) {
      return res.status(401).json("session expired");
    }
    const foundUser = await UserModel.findOne({ _id: userId });

    if (!foundUser) {
      return next();
    }
    req.user = foundUser;

    return next();

  } catch (error) {
    next(error);
  }
});
//userRoutes
app.use('/api', userRouter);
app.use('/api', searchRouter);
app.use('/api', joblicationRouter);
app.use('/api', noteRouter);
app.use('/api', adminRouter);

app.listen(port, () => console.log("joblication is working properly"));
