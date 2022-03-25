const mongoose = require('mongoose');
const validator = require("validator");
const authorSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true , "firstname is required"]
    },
    lastname:{
        type:String,
        required:[true , "lastname is required"]
    },
    title:{
        type:String,
        required:[true , "title is required"],
        enum:["Mr", "Mrs", "Miss"]
    },
    email:{
        type:String,
        required:[true , "email is required"],
        unique:true,
        validate:{
              validator: validator.isEmail,
              message: '{VALUE} is not a valid email',
              isAsync: false
            }
        },        
    password:{
        type:String,
        required:[true , "password is required"]
    },
    
},{timestamps: true});


module.exports = mongoose.model('author',authorSchema)