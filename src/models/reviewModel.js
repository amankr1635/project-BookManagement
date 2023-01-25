const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        required: true,
        ref: "book"
    },
    reviewedBy: {              //reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
        type: String,
        required: true,  // to check do we have to enter name or get from db
        default: "Guest",
        value: String,

    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
        //min 1 max 5 via regex
    },
    review: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timeStamps: true })

module.exports = mongoose.model("review", reviewSchema)
