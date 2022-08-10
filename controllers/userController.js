const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(JSON.stringify({ email, password }));
  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get a single user
const getUserDetails = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "bad request" });
  }

  const userDetails = await User.findById(id);

  if (!userDetails) {
    return res.status(404).json({ error: "Unknown user" });
  }

  res.status(200).json(userDetails);
};

module.exports = { signupUser, loginUser, getUserDetails };
