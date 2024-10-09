const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please provide first and last name");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Please provide valid email");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please provide strong password");
  }
};

module.exports = {
  validateSignUpData,
}