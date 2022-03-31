const mongoose = require("mongoose")

const userModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim:true
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Input more than 8 charachter"],
        maxlength: [15, "Enter less than 15 characters"],
        trim:true
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        pincode: {
            type: String
        }
    }

})
module.exports = mongoose.model("userCollection", userModel)