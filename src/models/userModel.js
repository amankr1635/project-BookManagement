const mongoose = require("mongoose");
// {
//   title: {string, mandatory, enum[Mr, Mrs, Miss]},
//   name: {string, mandatory},
//   phone: {string, mandatory, unique},
//   email: {string, mandatory, valid email, unique},
//   password: {string, mandatory, minLen 8, maxLen 15},
//   address: {
//     street: {string},
//     city: {string},
//     pincode: {string}
//   },
//   createdAt: {timestamp},
//   updatedAt: {timestamp}
// }
const userSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required : true
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
