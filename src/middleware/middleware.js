const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bookModel = require("../models/bookModel");

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
  let params = req.params.bookId;
  if (!mongoose.Types.ObjectId.isValid(params))
    return res.status(400).send({ status: false, message: "Invalid book ID" });
  let bookData = await bookModel.findOne({ _id: params });
  if (!bookData)
    return res.status(400).send({ status: false, message: "no book found" });
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

module.exports = { authentication, authorization };
