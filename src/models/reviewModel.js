const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewModel = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: true,
        ref: "bookCollection"
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest",
       // value: {type: String },
    }, //reviewer's name},
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
});

module.exports = new mongoose.model("reviewCollection", reviewModel);