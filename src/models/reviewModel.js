const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

// {
//     bookId: {ObjectId, mandatory, refs to book model},
//     reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//     reviewedAt: {Date, mandatory},
//     rating: {number, min 1, max 5, mandatory},
//     review: {string, optional}
//     isDeleted: {boolean, default: false},
//   }

const reviewModel = new mongoose.Schema({
    bookId:{
        type : ObjectId,
        required:true,
        ref:"Book"
    },
    reviewedBy:{              //reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
        type:String,
        required:true,
        default:"Guest",
        value:String
    },
    reviewedAt:{
        type:Date,
        required:true
    },
    rating:{
        type:Number,
    },
    review:String,
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timeStamps : true})

module.exports = mongoose.model("reviewModel", collegeSchema)
