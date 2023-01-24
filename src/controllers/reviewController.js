const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const {isValidName} = require("../validators/validation")

const addReview = async function (req, res) {
  let { bookId, review } = req.params;
  let body = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid id in params" });
      let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false});
      if (!findBook)
        return res.status(404).send({ status: false, message: "no data found" });    
  if (!body)
    return res
      .status(400)
      .send({ status: false, message: "please enter data in body" });
  if(!body.bookId)return res.status(400).send({status: false, message: "please enter bookId"})
//   let findBook = await bookModel.findOne({_id: body.bookId}) 
//   if(!findBook)
  if(!body.reviewedBy)return res.status(400).send({status: false, message: "please enter reviewedBy"})
  if(!isValidName(body.reviewedBy)) return res.status(400).send({status: false, message: "enter only alphabets"})
  if(!body.reviewedAt)return res.status(400).send({status: false, message: "please enter reviewedAt"})
  if(!body.rating)return res.status(400).send({status: false, message: "please enter rating"})
  if(typeof body.rating != "number") return res.status(400).send({status: false, message: "enter rating in number"})
  if(body.rating <1 ||body.rating >5) return res.status(400).send({status:false, message:"rating must be between 1&5"})





  let createReview = await reviewModel.create(body);
  let responseObject = {
    _id: createReview._id,
    bookId: createReview.bookId,
    reviewedBy: createReview.reviewedBy,
    reviewedAt: createReview.reviewedAt,
    rating: createReview.rating,
    review: createReview.review,
  };
  return res.status(201).send({ status: true, data: responseObject });
};

module.exports.addReview = addReview;
