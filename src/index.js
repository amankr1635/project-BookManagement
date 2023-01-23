const { Router } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const router =  require("./routes/router")
const app = express()

app.use(express.json())

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://Amankr:pwwELCe59UIUh9mj@cluster0.oxwexg5.mongodb.net/group06Database")
.then(()=> console.log("mongo Db is connected"))
.catch((err)=> console.log(err))

app.use("/",router)

app.listen(3000, function(){
    console.log("port is running on "+3000)
})