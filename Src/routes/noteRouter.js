const express = require('express');
const joblicationModel = require('../models/joblicationModels');
const noteModel = require('../models/noteModels');

noteRouter = express.Router();

noteRouter.post("/save-note", async (req, res, next)=>{
    const { savedCompanyId, note } = req.body
    const userId = req.user.id
    try {
        const foundCompany = await joblicationModel.findOne({_id : savedCompanyId })
        if(!foundCompany){
            return res.status(401).send("Please log-out and sign-in again")
        }
        const noteDocument = new noteModel({
            savedCompanyId,
            userId,
            note,
        })
        noteDocument.save();
        res.send("success")
    } catch (error) {
        res.status(404).send("error")
    }
})

module.exports = noteRouter;