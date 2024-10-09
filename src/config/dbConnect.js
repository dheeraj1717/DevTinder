const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: "DevTinder",
  });
};

module.exports = dbConnect;
