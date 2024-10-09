const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
 firstName: {
  type: String,
  required: true,
  minLength: 4,
  maxLength: 50,
 },
 lastName: {
  type: String,
 },
 emailId: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true, // removing white spaces
  validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error("Invalid email: "+ value);
  }
 },
},
 password: {
  type: String,
  required: true,
 },
 age: {
  type: Number,
  min: 18,
 },
 gender: {
  type: String,
  validate(value) {  // validate is only called when document is created
      if(!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
  }
 },
},
 photoUrl: {
  type: String,
  validate(value) {
      if(!validator.isURL(value)) {
        throw new Error("Invalid photo URL: "+ value);
  }
}
},
 about: {
  type: String,
  default: "About me",
 },
 skills: {
  type: [String],
 },
}, {
 timestamps: true,
});

module.exports = mongoose.model("User", userSchema);