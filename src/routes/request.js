const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("sending connection req");
    res.send("connection req sent");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = requestRouter;
