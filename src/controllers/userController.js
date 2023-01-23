const userModel = require("../models/userModel");

// - Create a user - atleast 5 users
// - Create a user document from request body.
// - Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like [this](#successful-response-structure)
// - Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)


const createUser = async function(req,res){
    let body = req.body;
    if(Object.keys(body).length == 0){
        return res.status(400).send({status: false, message: "please enter some data in body" })
    }
    let createData = await userModel.create(body)
    return res.status(201).send({status: true, message: "Suscessfully creeated", data: createData}) 
}


module.exports.createUser = createUser