const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const userModel = require("../models/userModel")
const moment = require("moment")

const bookModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim:true
        
    },
    excerpt: {
        type :String,
        required: true,
        trim:true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "userCollection",
        trim:true
    }, //refs to user model},
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    category: {
        type: String,
        required: true,
        trim:true
    },
    subcategory: {
        type: String,
        required: true,
        trim:true
    },
    reviews: {
        tyep: Number,
        default: 0,
        trim:true
       // comment: []
    }, // comment: Holds number of reviews of this book},
    deletedAt: {
        type: Date,
    }, //when the document is deleted},
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
      required: true,

    }, //format("YYYY-MM-DD")},
});

module.exports = mongoose.model("bookCollection", bookModel);