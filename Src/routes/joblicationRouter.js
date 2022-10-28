const express = require("express")
const joblicationModel = require("../models/joblicationModels")
const noteModel = require("../models/noteModels")

const joblicationRouter = express.Router()

joblicationRouter.post("/joblication", (req, res, next) => {
    const { jobTitle, company, location, url } = req.body
    const userId = req.user.id
    try {
        if(!req.user._id){
            res.send(401).send("you need to log in first");
            throw new Error("you are not logged in");
        }
        const jobDocument = new joblicationModel({
            jobTitle,
            company,
            location,
            url,
            userId:req.user._id,
            joblicationStatus: "watch",
        })
        jobDocument.save()
        res.json({savedCompanyId:jobDocument.id})
    } catch (error) {   
        next(error)
    }
    
})

joblicationRouter.post("/delete-company", async(req, res, next) => {
    try {
        const { savedCompanyId } = req.body;
        const deleteCompany = await joblicationModel.deleteOne(({ _id: savedCompanyId} ));
        const deleteNote = await noteModel.deleteMany({ savedCompanyId: savedCompanyId })
        // when deleting saved company, notes that are related to that company will also going to be deleted
        
        if(deleteCompany.acknowledged){
            res.send(deleteCompany.acknowledged)
        }else {
            res.status(400).send("error occured, please sign-out and log-in again")
        }
    } catch (error) {
        next(error)
    }
})

joblicationRouter.get("/get-savedCompany", async (req, res, next) => {
    try {
        const signInId = req.user.id
        const foundCompany = await joblicationModel.find({userId: signInId})
        res.send(foundCompany)
    } catch (error) {
        next(error)
    }
})

joblicationRouter.post("/joblication-status", async (req, res, next) => {
    try {
        const { companyId, joblicationStatus } = req.body;
        const userId = req.user.id
        const foundCompanyAndUpdated= await joblicationModel.findOneAndUpdate({ userId: userId, _id: companyId}, {
            joblicationStatus: joblicationStatus,
        })
        const foundUpdatedCompany = await joblicationModel.find({userId: userId})
        res.json({success:true, message: foundUpdatedCompany})
    } catch (error) {
        next(error)
    }
})

module.exports = joblicationRouter;