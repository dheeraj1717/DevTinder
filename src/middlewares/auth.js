const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req cookies
    const { token } = req.cookies;
    if(!token) {
      throw new Error("Token is not Valid!");
    }
    // Validate the token
    const isAuthenticated = await jwt.verify(token, "Dheeraj@12345");
    const { _id } = isAuthenticated;
    // Find the user
    const user = await User.findById({ _id });
    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

module.exports = {
  userAuth
}