const mongoose = require("mongoose");
const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel");
const { isValidName } = require("../validators/validation");

const createReview = async function (req, res) {
  try {
    let { bookId } = req.params;
    let body = req.body;

    if (!body || Object.keys(body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Enter data in body." });

    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res
        .status(400)
        .send({ status: false, message: "Enter valid id in params." });
    if (!body.bookId)
      return res
        .status(400)
        .send({ status: false, message: "Please enter BookId." });
    if (!mongoose.Types.ObjectId.isValid(body.bookId))
      return res
        .status(400)
        .send({ status: false, message: "Enter valid id in body." });

    let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!findBook)
      return res
        .status(404)
        .send({ status: false, message: "No book data found." });

    let findBookBybody = await bookModel.findOne({
      _id: body.bookId,
      isDeleted: false,
    });
    if (!findBookBybody)
      return res.status(400).send({ status: false, message: "No data exist." });

    if (!body.reviewedBy || !body.reviewedBy.trim()) body.reviewedBy = "Guest";
    body.reviewedBy = body.reviewedBy.trim();
    if (!isValidName(body.reviewedBy))
      return res
        .status(400)
        .send({ status: false, message: "Enter only alphabets." });

    body.reviewedAt = Date.now();

    if (!body.rating)
      return res
        .status(400)
        .send({ status: false, message: "Please enter rating." });
    if (typeof body.rating != "number")
      return res
        .status(400)
        .send({ status: false, message: "Enter rating in number." });
    if (![1, 2, 3, 4, 5].includes(body.rating))
      return res
        .status(400)
        .send({ status: false, message: "Rating must be 1,2,3,4 or 5." });

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
      .findOneAndUpdate(
        { _id: bookId, isDeleted: false },
        { $inc: { reviews: 1 }, releasedAt: Date.now() }
      )
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
        .send({ status: false, message: "No book data found." });

    bookData.reviews = responseObject;

    return res
      .status(200)
      .send({ status: true, message: "Books list", data: bookData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId;
    let reviewId = req.params.reviewId;
    let body = req.body;

    if (Object.keys(body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Enter data in body." });

    let bookPresent = await bookModel
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
if(body.rating){
    if (![1, 2, 3, 4, 5].includes(body.rating))
      return res
        .status(400)
        .send({ status: false, message: "Rating must be 1,2,3,4 or 5." });
 }

    let updatingReview = await reviewModel
      .findOneAndUpdate(
        { _id: reviewId, isDeleted: false },
        { ...body },
        { new: true }
      )
      .select({ __v: 0, isDeleted: 0 });

    bookPresent.reviewsData = updatingReview;
    return res
      .status(200)
      .send({ status: true, message: "Books list", data: bookPresent });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const deleteReview = async function (req, res) {
  try {
    const reviewId = req.params.reviewId;
    const bookId = req.params.bookId;

    await reviewModel.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      { isDeleted: true }
    );

    await bookModel.findOneAndUpdate(
      { _id: bookId, isDeleted: false },
      { $inc: { reviews: -1 } }
    );

    return res
      .status(200)
      .send({ status: true, message: "Review Successfully deleted." });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
