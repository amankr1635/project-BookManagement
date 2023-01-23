const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken")

// - Create a user - atleast 5 users
// - Create a user document from request body.
// - Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like [this](#successful-response-structure)
// - Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)


const createUser = async function (req, res) {
    let body = req.body;
    if (Object.keys(body).length == 0) {
        return res.status(400).send({ status: false, message: "please enter some data in body" })
    }
    let createData = await userModel.create(body)
    return res.status(201).send({ status: true, message: "Suscessfully creeated", data: createData })
}


const loginUser = async function (req, res) {
    try {
        let data = req.body
        const { email, password } = data

        if (!email || !password) res.status(400).send({ status: false, message: "Please enter Email Id and Password" })


        let userData = await userModel.findOne({ email: email, password: password })

        if (!userData) res.status(400).send({ status: false, message: "Invalid Email or Password" })

        let token = jwt.sign({ userData: userData._id.toString() }, "AAAB-Project04", { expiresIn: '2m' })
        console.log(token)

        return res.status(200).send({ status: true, message: "Success", data: token })


    }
    catch (err) {
        res.status(500).send({ status: false, message: "Login User", Error: err.message })
    }

}


module.exports.createUser = createUser
module.exports.loginUser = loginUser