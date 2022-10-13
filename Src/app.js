require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express');
const port = process.env.PORT;
const mongoose = require('mongoose')
const userRouter = require('./routes/userRouter')
const cors = require('cors')

const app = express();


mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING)
.then(()=> console.log("Connected to mongo db successfully"))
.catch(()=> console.log("unable to connect to mongodb from HJ"))

//cors
app.use(cors());

//parsing JSON to req.body
app.use(bodyParser.json())

//userRoutes
app.use(userRouter)


app.listen(port, () => console.log('joblication is working properly'))