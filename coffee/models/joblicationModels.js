const mongoose  = require("mongoose");

const joblicationSchema = new mongoose.Schema({
    jobTitle:{ type: String, trim: true },
    company:{ type: String, trim: true },
    location:{ type: String, trim: true},
    url:{ type: String, trim: true},
    userId:{ type: String, trim: true, require },
    joblicationStatus:{type: String, trim: true, require},
})

const joblicationModel = mongoose.model("myCompany", joblicationSchema);

module.exports = joblicationModel;