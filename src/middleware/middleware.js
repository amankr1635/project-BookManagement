const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

// ------Authentication------

const authentication = async function (req, res, next) {
  let token = req.headers["x-auth-token"];
  if (!token) {
    return res
      .status(400)
      .send({ status: false, message: "token is required in headers" });
  }
  jwt.verify(token, "AAAB-Project04", (err, decodedToken) => {
    if (err) {
      return res.status(400).send({ status: false, message: "invalid token" });
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
};
// -----Authorization------------

const authorization = async function (req, res, next) {
  let userId = req.decodedToken.userId;
  let bookId = req.params.bookId;
  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res.status(400).send({ status: false, message: "Invalid book ID" });

  let bookData = await bookModel.findOne({ _id: bookId });
  if (!bookData)
    return res
      .status(400)
      .send({ status: false, message: "Book with this ID is not present." });

  if (userId != bookData.userId)
    return res
      .status(403)
      .send({ status: false, message: "You are not authorized" });
  if (bookData.isDeleted == true) {
    return res
      .status(404)
      .send({ status: false, message: "document already deleted" });
  }

  next();
};

const reviewAuth = async function (req, res, next) {
  let bookId = req.params.bookId;
  let reviewId = req.params.reviewId;
  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res.status(400).send({ status: false, message: "Invalid book ID" });

  let bookData = await bookModel.findOne({ _id: bookId });
  if (!bookData)
    return res
      .status(400)
      .send({ status: false, message: "Book with this ID is not present." });

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res
      .status(400)
      .send({ status: false, message: "Invalid reviewId " });
  let findreviewId = await reviewModel.findOne({
    _id: reviewId,
    isDeleted: false,
  });
  if (!findreviewId)
    return res
      .status(400)
      .send({
        status: false,
        message: "Review is not present with given Review Id.",
      });
  if (bookData._id.toString() != findreviewId.bookId.toString())
    return res
      .status(400)
      .send({ status: false, message: "You have not reviewed in this book." });

  next();
};

module.exports = { authentication, authorization, reviewAuth };
