const userModel = require("../models/userModel");
const { isValidateEmail, passwordVal, isValidName, isValidNo, isValidPin, } = require("../validators/validation");
const jwt = require('jsonwebtoken')



const createUser = async function (req, res) {
  let body = req.body;
  if (Object.keys(body).length == 0) {
    return res
      .status(400)
      .send({ status: false, message: "please enter some data in body" });
  }
  if (!body.title)
    return res
      .status(400)
      .send({ status: false, message: "please Enter title in body" });

  if (body.title != "Mr" && body.title != "Mrs" && body.title != "Miss".trim())
    return res.status(400).send({
      status: false,
      message: "Please enter title as 'Mr', 'Mrs', 'Miss', must be in string",
    });

  if (!body.name)
    return res
      .status(400)
      .send({ status: false, message: "Please Enter name in body" });

  if (!isValidName(body.name.trim()))
    return res
      .status(400)
      .send({ status: false, message: "Name only contains Alphabets" });

  if (!body.phone)
    return res
      .status(400)
      .send({ status: false, message: "Please Enter phone in body" });

  if (!isValidNo(body.phone.trim()))
    return res
      .status(400)
      .send({ status: false, message: "please enter a valid Mobile no." });

  if (!body.email)
    return res
      .status(400)
      .send({ status: false, message: "Please Enter email in body" });

  if (!isValidateEmail(body.email.trim()))
    return res
      .status(400)
      .send({ status: false, message: "please Enter valid email" });

  if (!body.password)
    return res
      .status(400)
      .send({ status: false, message: "Please Enter password in body" });

  if (!passwordVal(body.password.trim()))
    return res.status(400).send({
      status: false,
      message:
        "Password must be Range in 8 to 15 , Please enter at least 1 lowercase, 1 uppercase, 1 numeric character and one special character",
    });
  if (!isValidPin(body.address.pincode))
    return res
      .status(400)
      .send({ status: false, message: "Please enter valid pincode" });

  let findData = await userModel.findOne({ phone: body.phone });
  if (findData) {
    return res
      .status(200)
      .send({ status: true, message: "User already registerd" });
  }
  let createData = await userModel.create(body);
  return res
    .status(201)
    .send({ status: true, message: "Suscess", data: createData });
};



const loginUser = async function (req, res) {
  try {
    let data = req.body
    const { email, password } = data

    if (!email || !password) res.status(400).send({ status: false, message: "Please enter Email Id and Password" })


    let userData = await userModel.findOne({ email: email, password: password })

    if (!userData) res.status(400).send({ status: false, message: "Invalid Email or Password" })

    let token = jwt.sign({ userData: userData._id.toString() }, "AAAB-Project04", { expiresIn: '2m' })
    

    return res.status(200).send({ status: true, message: "Success", data: token })


  }
  catch (err) {
    res.status(500).send({ status: false, message: "Login User", Error: err.message })
  }

}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
