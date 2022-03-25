const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true , "title is required"]
    },
    body: {
        type: String,
        required: [true , "body is required"]
    },
    authorId: {
        required:[true , "author-id is required"],
        type:ObjectId,
        ref:"author"
    },
    tags:[String],
    category:{
        type : String,
        required : [true , "category is required"]
    },

    subcategory : ["String"], 
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type: Date,
          default: undefined
    },
    publishedAt:{
        type: Date,
          default: Date.now
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    

},{timestamps:true}) 
module.exports = mongoose.model('blogs', blogsSchema);