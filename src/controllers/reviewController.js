const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const { isValidName, regForDate } = require("../validators/validation");

const createReview = async function (req, res) {
  try {
    let { bookId, review } = req.params;
    let body = req.body;

    if (!body || Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "enter data in body" })

    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res
        .status(400)
        .send({ status: false, message: "enter valid id in params" });
    if (!body.bookId)
      return res
        .status(400)
        .send({ status: false, message: "please enter bookId" });
    if (!mongoose.Types.ObjectId.isValid(body.bookId))
      return res
        .status(400)
        .send({ status: false, message: "enter valid id in body" });

    let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!findBook)
      return res
        .status(404)
        .send({ status: false, message: "no book data found" });

    let findBookBybody = await bookModel.findOne({ _id: body.bookId, isDeleted: false });
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
    if (![1, 2, 3, 4, 5].includes(body.rating))
      return res
        .status(400)
        .send({ status: false, message: "rating must be 1,2,3,4 or 5" });

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
      .findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })
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
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
};



const updateReview = async function (req, res) {
  let bookId = req.params.bookId;
  let reviewId = req.params.reviewId;
  let body = req.body;
  let { review, rating, reviewedBy } = body

  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid book ID in params" });

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid review ID in params" });

  if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "enter data in body" })
  let bookPresent = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({
    __v: 0,
    ISBN: 0,
    createdAt: 0,
    updatedAt: 0,
    isDeleted: 0,
    releasedAt: 0,
  }).lean();

  if (!bookPresent) return res.status(404).send({ status: false, message: "book with this ID is not present" })

  let updateData = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { ...body }, { new: true }).select({ __v: 0, isDeleted: 0 })

  if (!updateData) return res.status(404).send({ status: false, message: "review with this ID is not present" })
  if (bookPresent._id.toString() != updateData.bookId.toString()) return res.status(400).send({ status: false, message: "you have not reviewed in this book" })
  bookPresent.reviewsData = updateData
  return res.status(200).send({ status: true, message: "Books list", data: bookPresent })


}

const deleteReview = async function (req, res) {

  const reviewId = req.params.reviewId
  const bookId = req.params.bookId

  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid book ID in params" });

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res
      .status(400)
      .send({ status: false, message: "enter valid review ID in params" });

  let findreviewId = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { isDeleted: true })
  if (!findreviewId) return res.status(400).send({ status: false, message: "ReviewId is not present" })
  let findBookId = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } })
  if (!findBookId) return res.status(400).send({ status: false, message: "BookId is not present" })


  if (findBookId._id.toString() != findreviewId.bookId.toString()) return res.status(400).send({ status: false, message: "you have not reviewed in this book" })

  return res.status(200).send({ status: true, message: "Review Successfully deleted" })

}



module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
