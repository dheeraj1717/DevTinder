const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // refrence to User collection
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // check if send and receiver ids are same
  if (connectionRequest.senderId.equals(connectionRequest.receiverId)) {
    throw new Error("Cannot send request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
