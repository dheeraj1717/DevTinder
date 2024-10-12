const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const receiverId = req.params.receiverId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (status && !allowedStatus.includes(status)) {
        res.status(400).json({ message: "Invalid status type" + status });
      }

      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "User not found" });
      }
      // if there is an existing connectionRequest

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      console.log(existingRequest);

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        senderId,
        receiverId,
        status,
      });

      await connectionRequest.save().then(() => {
        let dynamicMessage = "";

        if (status === "ignored") {
          dynamicMessage = `${req.user.firstName} has ignored the request from ${receiver.firstName}.`;
        } else if (status === "interested") {
          dynamicMessage = `${req.user.firstName} is interested in connecting with ${receiver.firstName}.`;
        }

        res.json({
          message: dynamicMessage,
        });
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;
      await connectionRequest.save().then(() => {
        res.json({
          message: "Connection request updated successfully",
        });
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = requestRouter;
