const mongoose  = require("mongoose");

const searchSchema = new mongoose.Schema({
    jobTitle:{ type: String, trim: true },
    location:{ type: Stringm, trim: true}
})