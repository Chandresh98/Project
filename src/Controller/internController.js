const internModel = require("../Modle/internModel")
const collegeModel = require("../Modle/collegeModel")
const express = require('express');
const { Router } = require('express');
const router = express.Router();

//CREATEINTERN-
const createIntern = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: 'The request is not valid as the data are required.' })
        let collegeId = req.body.collegeId
        let collegeDetail = await collegeModel.findById(collegeId)
        if (!collegeDetail) return res.status(404).send({ status: false, message: 'The request is not valid as no collage is present with the given collage id' })
        let createNewIntern = await internModel.create(data)
        res.status(201).send({ status: true, data: createNewIntern })
    }

    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}



const getDetails = async function (req, res) {
    try {
        {
            let coll_name = req.query.collegeName
            if (!coll_name) return res.status(400).send({ status: false, message: "please enter collage name" })
            let data = await collegeModel.findOne({ name: coll_name }).select({ name: true, fullName: true, logoLink: true, _id: false })
            let data1 = await collegeModel.findOne({ name: coll_name })
            if (!data) return res.status(403).send({ status: false, message: "The value is Invalid" });
            const C_id = data1._id
            let internDetails = await internModel.find({ collegeId: C_id, isDeleted: false }).select({ name: true, email: true, mobile: true })
            res.send({ data: data, interests: internDetails })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createIntern = createIntern
module.exports.getDetails = getDetails
