const userModel = require("../models/userModel");
const {
  isValidateEmail,
  passwordVal,
  isValidName,
  isValidNo,
  isValidPin,
} = require("../validators/validation");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
  try {
    let body = req.body;
    const { title, name, phone, email, password, address } = body;
    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "please enter some data in body" });
    }
    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "please Enter title in body" });

    if (title != "Mr" && title != "Mrs" && title != "Miss".trim())
      return res.status(400).send({
        status: false,
        message: "Please enter title as 'Mr', 'Mrs', 'Miss', must be in string",
      });

    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter name in body" });

    if (!isValidName(name.trim()))
      return res
        .status(400)
        .send({ status: false, message: "Name only contains Alphabets" });

    if (!phone)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter phone in body" });

    if (!isValidNo(phone.trim()))
      return res
        .status(400)
        .send({ status: false, message: "please enter a valid Mobile no." });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter email in body" });

    if (!isValidateEmail(email.trim()))
      return res
        .status(400)
        .send({ status: false, message: "please Enter valid email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter password in body" });

    if (!passwordVal(password.trim()))
      return res.status(400).send({
        status: false,
        message:
          "Password must be Range in 8 to 15 , Please enter at least 1 lowercase, 1 uppercase, 1 numeric character and one special character",
      });
    if (!isValidPin(address.pincode))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid pincode" });

    let findPhone = await userModel.findOne({ phone: phone });
    if (findPhone) {
      return res
        .status(200)
        .send({ status: true, message: "User already registerd" });
    }
    let findEmail = await userModel.findOne({ email: email });
    if (findEmail) {
      return res
        .status(200)
        .send({ status: true, message: "email already registerd" });
    }
    let createData = await userModel.create(body);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: createData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let data = req.body;
    const { email, password } = data;

    if (!email || !password)
      res
        .status(400)
        .send({ status: false, message: "Please enter Email Id and Password" });

    let userData = await userModel.findOne({
      email: email,
      password: password,
    });
    if (!userData)
      res
        .status(400)
        .send({ status: false, message: "Invalid Email or Password" });

    let token = jwt.sign(
      { userId: userData._id.toString() },
      "AAAB-Project04",
      { expiresIn: "24h" }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: token });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Login User", Error: err.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
