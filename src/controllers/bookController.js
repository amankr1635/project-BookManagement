const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const { regForDate, isValidString, ISBNRegex } = require("../validators/validation");

const createBook = async function (req, res) {
  try {
    let body = req.body;
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } =
      body;

    if (Object.keys(body).length == 0)
      return res.status(400).send({ status: false, message: "Provide data" });

    if (!title)
      return res.status(400).send({ status: false, message: "Provide title" });
    if (!isValidString(title))
      return res
        .status(400)
        .send({ status: false, message: "Enter title in string form" });
    if (title.length < 3)
      return res
        .status(400)
        .send({ status: false, message: "Can contain only minimum 3 letters" });
    let titlePresent = await bookModel.findOne({ title: title });
    if (titlePresent)
      return res
        .status(400)
        .send({ status: false, message: "Title is already present" });

    if (!excerpt)
      return res
        .status(400)
        .send({ status: false, message: "Provide excerpt" });
    if (!isValidString(excerpt))
      return res
        .status(400)
        .send({ status: false, message: "Enter excerpt in string form" });
    if (excerpt.length < 3)
      return res
        .status(400)
        .send({ status: false, message: "Must contain minimum 3 letters" });

    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "Provide user ID" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .send({ status: false, msg: "user ID is incorrect" });

    if (!ISBN)
      return res.status(400).send({ status: false, message: "Provide ISBN" });
    if (!isValidString(ISBN))
      return res
        .status(400)
        .send({ status: false, message: "Enter ISBN in string 1" });

    if (!ISBNRegex(ISBN))
      return res
        .status(400)
        .send({ status: false, message: "Enter valid ISBN" });

    let isbnPresent = await bookModel.findOne({ ISBN: ISBN });
    if (isbnPresent)
      return res
        .status(400)
        .send({ status: false, message: "ISBN is already present" });

    if (!category)
      return res
        .status(400)
        .send({ status: false, message: "Provide category" });
    if (!isValidString(category))
      return res
        .status(400)
        .send({ status: false, message: "Enter category in string" });

    if (!subcategory)
      return res
        .status(400)
        .send({ status: false, message: "Provide subcategory" });
    if (!isValidString(subcategory))
      return res
        .status(400)
        .send({ status: false, message: "Enter subcategory in string" });

    if (!releasedAt)
      return res
        .status(400)
        .send({ status: false, message: "Provide released time" });

    if (regForDate(releasedAt) == false)
      return res.status(400).send({
        status: false,
        message: "Please enter a valid date(YYYY-MM-DD)",
      });
    let checkUser = await userModel.findById(userId);
    if (!checkUser)
      return res.status(404).send({
        status: false,
        message: "No documents found with this user ID",
      });


    //Authorization---------------------------------------------
    let tokenId = req.decodedToken.userId;
    if (tokenId != checkUser._id) return res.status(403).send({
      status: false,
      message: "You are not authorized",
    });
    let created = await bookModel.create(body);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: created });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const getBooks = async function (req, res) {
  try {
    let query = req.query;
    const { userId, category, subcategory } = query;
    if (Object.keys(query).length == 0) {
      let allBooks = await bookModel.find({ isDeleted: false })
      return res
        .status(200)
        .send({ status: true, message: "Success", data: allBooks });
    }
    if (!(userId || category || subcategory))
      return res.status(400).send({
        status: false,
        message: "userId,category or subcategory expected",
      });
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId))
        return res
          .status(400)
          .send({ status: false, msg: "user ID is incorrect" });
    }
    let bookData = await bookModel
      .find({ ...query, isDeleted: false })
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
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



const getBooksByParams = async function (req, res) {
  let bookId = req.params.bookId;
  if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Enter valid book ID" })
  let bookData = await bookModel.findOne({ id: bookId, isDeleted: false }).select({ _v: 0, ISBN: 0 }).lean()
  if (Object.keys(bookData).length == 0) return res.status(404).send({ status: false, message: "No books found this ID" })
  let reviewData = await reviewModel.find({ isDeleted: false });
  console.log(reviewData)
  bookData.reviews = reviewData.length
  bookData.reviewsData = reviewData

  return res.status(200).send({ status: true, message: 'Books list', data: bookData })

}

const updateBooks = async function (req, res) {
  let bookId = req.params.bookId
  let body = req.body
  let { title, excerpt, releasedAt, ISBN } = body

  let findData = await bookModel.find({ title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN })
  console.log(findData)
  if (findData) return res.status(200).send({ status: true, message: "data already exist" })

  let updateData = await bookModel.findOneAndUpdate({ _id: bookId }, { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }, { new: true })

  return res.status(200).send({ status: true, message: "Success", data: updateData })



}

const deleteBookPathParam = async function (req, res) {
  let bookId = req.params.bookId
  // if (!mongoose.Types.ObjectId.isValid(bookId))return res.status(400).send({ status: false, msg: "Book ID is incorrect" });
  //  let findBook = await bookModel.findById({_id:bookId})
  //  if(!findBook) return res.status(400).send({status:false,message:"No document exist"})
  //  if(findBook.isDeleted==true){
  //    return res.status(400).send({status:false,message:"No document found"})
  //  }
  let updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true }, { new: true })
  return res.status(200).send({ status: true, message: "Books deleted" })

}




module.exports.createBook = createBook;
module.exports.getBooks = getBooks;
module.exports.getBooksByParams = getBooksByParams
module.exports.updateBooks = updateBooks
module.exports.deleteBookPathParam = deleteBookPathParam


