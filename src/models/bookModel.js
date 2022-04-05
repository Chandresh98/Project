const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


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
        ref: "usermbook",
        trim:true
    }, 
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    category: {
        type: String,
        required: true,
        trim:true,
        lowercase:true
    },
    subcategory: {
        type: String,
        required: true,
        trim:true,
        lowercase:true
    },
    reviews: {
        type: Number,
        default:0,
        required:true
        
       
    }, 
    deletedAt: {
        type: Date,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
      required: true,

    }, 
},{timestamps:true});

module.exports = mongoose.model("bookmdata", bookModel);