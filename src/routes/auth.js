const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of sign up data
    validateSignUpData(req);

    // Encrypting password
    const { firstName, lastName, emailId, password, age, gender, skills } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      skills,
    });
    await user.save().then(() => {
      res.send("User created successfully");
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      } else {
        // create a jwt token
        const token = await user.getJWTToken();

        res.cookie("token", token, {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        res.send("Login successful");
      }
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});
module.exports = authRouter;
