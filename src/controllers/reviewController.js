const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const { isValidName, regForDate } = require("../validators/validation");

const createReview = async function (req, res) {
  let { bookId, review } = req.params;
  let body = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid id in params" });
  if (!mongoose.Types.ObjectId.isValid(body.bookId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid id in body" });

  let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
  if (!findBook)
    return res
      .status(404)
      .send({ status: false, message: "no book data found" });
  if (!body)
    return res
      .status(400)
      .send({ status: false, message: "please enter data in body" });
  if (!body.bookId)
    return res
      .status(400)
      .send({ status: false, message: "please enter bookId" });
  let findBookBybody = await bookModel.findOne({ _id: body.bookId });
  if (!findBookBybody)
    return res.status(400).send({ status: false, message: "no data exist" });
  
  if (!body.reviewedBy || !body.reviewedBy.trim()) body.reviewedBy = "Guest";
  
  body.reviewedBy = body.reviewedBy.trim();
  if (!isValidName(body.reviewedBy))
    return res
      .status(400)
      .send({ status: false, message: "enter only alphabets" });
  if (!body.reviewedAt)
    return res
      .status(400)
      .send({ status: false, message: "please enter reviewedAt" });
  if (regForDate(body.reviewedAt) == false)
    return res.status(400).send({
      status: false,
      message: "Please enter a valid date(YYYY-MM-DD)",
    });
  if (!body.rating)
    return res
      .status(400)
      .send({ status: false, message: "please enter rating" });
  if (typeof body.rating != "number")
    return res
      .status(400)
      .send({ status: false, message: "enter rating in number" });
  if (body.rating < 1 || body.rating > 5)
    return res
      .status(400)
      .send({ status: false, message: "rating must be between 1&5" });

  let createData = await reviewModel.create(body);
  let responseObject = {
    _id: createData._id,
    bookId: createData.bookId,
    reviewedBy: createData.reviewedBy,
    reviewedAt: createData.reviewedAt,
    rating: createData.rating,
    review: createData.review,
  };
  let bookData = await bookModel
    .findOne({ _id: bookId, isDeleted: false })
    .select({
      __v: 0,
      ISBN: 0,
      createdAt: 0,
      updatedAt: 0,
      isDeleted: 0,
      releasedAt: 0,
    })
    .lean();
  if (!bookData)
    return res
      .status(404)
      .send({ status: false, message: "no book data found" });

  bookData.reviews = responseObject;

  return res
    .status(200)
    .send({ status: true, message: "Books list", data: bookData });
};

module.exports.createReview = createReview;
