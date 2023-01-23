const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required : true,
        trim : true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
      // valid check
    },
    password: {
      type: String,
      required: true
      // min 8 max -15      
    },
    address: {
      street: String,
      city: String,
      pincode: String
    }
  },{ timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
