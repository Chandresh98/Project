const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const validator = require('validator')
const object = mongoose.Schema.Types.ObjectId

const internModel = new mongoose.Schema({
    name:{
        type:String,
        required: [true ,"Name is required !" ],
        trim:true,
        lowercase: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true,
        validate:{
              validator: validator.isEmail,
              message: '{VALUE} is not a valid email',
              isAsync: false
            }
        },        
        mobile:{
        type: String,
        required:[true , "Phone number is required !" ],
        unique:true,
        validate: {
            validator: (v) => {
            return v.length == 10;
            },
        }
    },
    collegeId:{
        type:object,
        ref:'college',
        required:[true, "collegeId is required !" ],
        trim:true,
    },
    isDeleted:{
     type:Boolean,
     default:false}
},{timestamps:true})

module.exports = mongoose.model('inter', internModel )