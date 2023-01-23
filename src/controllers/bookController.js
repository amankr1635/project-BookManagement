const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const { regForDate, isValidString } = require("../validators/validation");

const createBook = async function (req, res) {
  let data = req.body;
  let userId = req.body.userId;

  if (Object.keys(data).length == 0)
    return res.status(400).send({ status: false, message: "Provide data" });

  if (!data.title)
    return res.status(400).send({ status: false, message: "Provide title" });
  if (!isValidString(data.title))
    return res
      .status(400)
      .send({ status: false, message: "Enter title in string form" });
  if (data.title.length < 3)
    return res
      .status(400)
      .send({ status: false, message: "Can contain only minimum 3 letters" });
  let titlePresent = await bookModel.findOne({ title: data.title });
  if (titlePresent)
    return res
      .status(400)
      .send({ status: false, message: "Title is already present" });

  if (!data.excerpt)
    return res.status(400).send({ status: false, message: "Provide excerpt" });
  if (!isValidString(data.excerpt))
    return res
      .status(400)
      .send({ status: false, message: "Enter excerpt in string form" });
  if (data.excerpt.length < 3)
    return res
      .status(400)
      .send({ status: false, message: "Must contain minimum 3 letters" });

  if (!data.userId)
    return res.status(400).send({ status: false, message: "Provide user ID" });
  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).send({ status: false, msg: "user ID is incorrect" });

  if (!data.ISBN)
    return res.status(400).send({ status: false, message: "Provide ISBN" });
  if (!isValidString(data.ISBN))
    return res
      .status(400)
      .send({ status: false, message: "Enter ISBN in string" });

  if (data.ISBN.length != 10 && data.ISBN.length != 13)
    return res
      .status(400)
      .send({ status: false, message: "ISBN must be of length 10 or 13" });
  let isbnPresent = await bookModel.findOne({ ISBN: data.ISBN });
  if (isbnPresent)
    return res
      .status(400)
      .send({ status: false, message: "ISBN is already present" });

  if (!data.category)
    return res.status(400).send({ status: false, message: "Provide category" });
  if (!isValidString(data.category))
    return res
      .status(400)
      .send({ status: false, message: "Enter category in string" });

  if (!data.subcategory)
    return res
      .status(400)
      .send({ status: false, message: "Provide subcategory" });
  if (!isValidString(data.subcategory))
    return res
      .status(400)
      .send({ status: false, message: "Enter subcategory in string" });

  if (!data.releasedAt)
    return res
      .status(400)
      .send({ status: false, message: "Provide released time" });

      
  if (regForDate(data.releasedAt) == false)
  return res.status(400).send({
    status: false,
    message: "Please enter a valid date(YYYY-MM-DD)",
  });
  let checkUser = await userModel.findById(userId);
  if (!checkUser)
    return res
      .status(404)
      .send({ status: false, message: "No documents found with this user ID" });

  let created = await bookModel.create(data);
  return res
    .status(201)
    .send({ status: true, message: "Success", data: created });
};

const getBooks = async function (req, res) {
  let books = req.query;
  if (Object.keys(books).length == 0)
    return res
      .status(404)
      .send({ status: false, message: "Please enter some data" });
      if(!books.userId||!books.category||!books.subcategory) return res.status(400).send({status:false,message:"userId,category or subcategory expected"})
      if (!mongoose.Types.ObjectId.isValid(books.userId))
    return res.status(400).send({ status: false, msg: "user ID is incorrect" });
  let bookData = await bookModel
    .find({ ...books, isDeleted: false })
    .select({
      title: 1,
      excerpt: 1,
      userId: 1,
      category: 1,
      releasedAt: 1,
      reviews: 1,
    })
    .sort({ title: 1 });

 

  if (bookData.length == 0) {
    return res
      .status(404)
      .send({ status: false, message: "no document found" });
  }
  return res
    .status(200)
    .send({ status: true, message: "success", data: bookData });
};

module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
