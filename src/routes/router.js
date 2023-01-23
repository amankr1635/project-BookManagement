const express = require("express");
const router = express.Router()

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController")

router.post("/register", userController.createUser)
router.post("/books",bookController.createBook)



router.all("/*",function(req,res){
    return res.status(400).send({status: false, message: "invlalid http request"})
} )

module.exports = router