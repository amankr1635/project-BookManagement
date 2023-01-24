const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

// ------Authentication------

const authentication = async function (req,res,next){
let token = req.headers["x-auth-token"];
if(!token){
    return res.status(400).send({status :false , message: "token is required in headers"})
}
 jwt.verify(token, "AAAB-Project04", (err,decodedToken)=>{
if(err){
    return res.status(400).send({status:false, message:"invalid token"})
}else{
    req.decodedToken= decodedToken
next()
}

})
}
// -----Authorization------------

const authorization= async function (req,res,next){
    let userId=req.decodedToken.userId;
    console.log(userId)
    let params=req.params.bookId;
    if(!mongoose.Types.ObjectId.isValid(params)) return res.status(400).send({status:false,message:"Invalid book ID"})
    let authorize= await bookModel.findOne({_id:params})
    if(authorize.isDeleted==true){
        return res.status(400).send({status:false,message:"No document found"})
      }
    console.log(authorize)
    if(userId!=authorize._id) return res.status(403).send({status:false,message:"You are not authorized"})

    next()

}




module.exports = {authentication,authorization}