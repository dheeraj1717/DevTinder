const express = require("express");
const dbConnect = require("./config/dbConnect");
const User = require("./models/user");
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
app.use(express.json());

app.post("/signUp", async (req, res) => {
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

app.post("/logIn", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid Credentials");
      } else {
        res.send("Login successful");
      }
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("update failed: " + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

dbConnect()
  .then(() => {
    console.log("Connected to DB");
    app.listen(8000, () => {
      console.log("Server started on port 8000");
    });
  })
  .catch(() => {
    console.log("Error connecting to DB");
  });
