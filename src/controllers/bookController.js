const mongoose=require("mongoose");
const bookModel  = require("../models/bookModel");
const userModel=require("../models/userModel");
const reviewModel=require("../models/reviewModel");
const moment=require("moment")

// - Create a book document from request body. Get userId in request body only.
// - Make sure the userId is a valid userId by checking the user exist in the users collection.
// - Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
// - Create atleast 10 books for each user
// - Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)

const createBook=async function(req,res){
let data=req.body;
let userId=req.body.userId;

if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"Provide data"});

if(!data.title)  return res.status(400).send({status:false,message:"Provide title"});

if(!data.excerpt)  return res.status(400).send({status:false,message:"Provide excerpt"});

if(!data.excerpt)  return res.status(400).send({status:false,message:"Provide excerpt"});

if(!data.ISBN)  return res.status(400).send({status:false,message:"Provide ISBN"});
let isbnPresent=await bookModel.findOne({ISBN:data.ISBN});
if(isbnPresent) return res.status(400).send({status:false,message:"ISBN is already present"});

if(!userId) return res.status(400).send({status:false,message:"Provide user ID"});
if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, msg: "user ID is incorrect"});

if(!data.category) return res.status(400).send({status:false,message:"Provide category"});

if(!data.subcategory) return res.status(400).send({status:false,message:"Provide subcategory"});

// if(!data.releasedAt) return res.status(400).send({status:false,message:"Provide released time"});

//if(!delete) return res.status(400).send({status:false,message:"Provide review"});



let checkUser= await userModel.findById(userId);
if(!checkUser) return res.status(404).send({status:false,message:"No documents found with this user ID"})

data.releasedAt=moment().format('MM/DD/YYYY');
//console.log(typeof data.releasedAt)

 let reviewCount=await reviewModel.find().count();
 console.log(reviewCount);

let created= await  bookModel.create(data);
return res.status(201).send({status:true,message:"Book Created",data:created})
 
}


module.exports.createBook=createBook