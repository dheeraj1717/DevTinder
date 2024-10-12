const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// get all the pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      receiverId: loggedInUser._id,
      status: "interested",
    }).populate("senderId", ["firstName", "lastName"]); // can also write like a string in populate "firstName lastName" separated by spaces
    res.send(connectionRequests);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { receiverId: loggedInUser._id, status: "accepted" },
        { senderId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("senderId", USER_SAFE_DATA)
      .populate("receiverId", USER_SAFE_DATA);

    const data = connectionRequests.map((connectionRequest) => {
      if (
        // we cannot compare two ids of mongodb directly
        connectionRequest.senderId._id.toString() ===
        loggedInUser._id.toString()
      ) {
        return connectionRequest.receiverId;
      } else {
        return connectionRequest.senderId;
      }
    });
    console.log(data);
    res.send(data);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
