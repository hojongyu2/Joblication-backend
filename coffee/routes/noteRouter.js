const express = require('express');
const req = require('express/lib/request');
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

        const foundNotes = await noteModel.find({savedCompanyId:savedCompanyId, userId:userId})
        res.json(foundNotes)
    } catch (error) {
        res.status(404).send("error")
    }
})

noteRouter.post("/get-notes", async (req, res, next) => {
    try {
        const { savedCompanyId } = req.body;
        const userId = req.user.id

        const foundNote = await noteModel.find({ savedCompanyId: savedCompanyId, userId: userId});
        res.json(foundNote)
    } catch (error) {
        next(error)
    }
})

noteRouter.post('/delete-note', async (req, res, next) => {
    try {
        const { savedCompanyId, note } = req.body;
        const foundNote = await noteModel.deleteOne({ note: note, savedCompanyId: savedCompanyId});

        res.json(foundNote.acknowledged)
    } catch (error) {
        next(error)
    }
})

module.exports = noteRouter;