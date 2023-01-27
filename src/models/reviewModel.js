const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const reviewSchema = new mongoose.Schema(
  {
    bookId: {
      type: ObjectId,
      required: true,
      ref: "book"
    },
    reviewedBy: {
      type: String,
      required: true, 
      default: "Guest",
      value: String
    },
    reviewedAt: {
      type: Date,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    review: String,
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timeStamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
