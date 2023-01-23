const jwt = require("jsonwebtoken");

// ------Authorisation------

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






module.exports = {authentication}