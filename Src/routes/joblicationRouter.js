const express = require("express")
const joblicationModel = require("../models/joblicationModels")

const joblicationRouter = express.Router()

joblicationRouter.post("/joblication", (req, res, next) => {
    const { jobTitle, company, location, url } = req.body
    const userId = req.user.id
    console.log(userId)
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
        })
        jobDocument.save()
        res.json({savedCompanyId:jobDocument.id})
    } catch (error) {   
        next(error)
    }
    
})

// joblicationRouter.post("/save-note", (req, res, next)=>{
//     try {
        
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = joblicationRouter;