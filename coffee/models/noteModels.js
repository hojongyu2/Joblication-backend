const mongoose  = require("mongoose");

const noteSchema = new mongoose.Schema({
    savedCompanyId:{ type: String, trim: true, require },
    userId:{ type: String, trim: true, require },
    note:{ type: String, trim: true },
})

const noteModel = mongoose.model("notes", noteSchema);

module.exports = noteModel;