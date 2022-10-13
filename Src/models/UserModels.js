const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{ type: String, require: true, trim: true},
    lastName:{ type: String, require: true, trim: true},
    email:{ type: String, require: true, trim: true, unique: true},
    hashedPassword:{ type: String, require: true},
    jobTitle:{ type: String, require: true, trim: true},
    idAdmin:{ type: Boolean, require: true, defalut: false},
})

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;