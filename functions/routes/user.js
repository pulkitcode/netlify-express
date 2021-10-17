const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

///////////////////////////////////user register

router.post("/register", async (req, res) => {
  // * required array
  let required = [];

  if (!req.body.email) required.push("email");
  if (!req.body.password) required.push("password");
  if (!req.body.passwordCheck) required.push("passwordCheck");
  if (!req.body.displayName) required.push("displayName");

  if (required.length === 0) {
    try {
      let { email, password, passwordCheck, displayName } = req.body;

      // * validate

      if (password.length < 5)
        return res.status(400).json({
          msg: "The password needs to be at least 5 characters long.",
        });
      if (password !== passwordCheck)
        return res
          .status(400)
          .json({ msg: "Enter the same password twice for verification." });

      const existingUser = await User.findOne({ email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ msg: "An account with this email already exists." });

      if (!displayName) displayName = email;

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: passwordHash,
        displayName,
      });
      const savedUser = await newUser.save();
      const newRegisteredUser = await User.findById({
        _id: savedUser._id,
      }).select("-password");
      res.json(newRegisteredUser);
      console.log(newRegisteredUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    }
  } else {
    // * mapping the required array list
    let message = required.map((item) => {
      return " " + item;
    });
    return res.status(400).json({
      status: "fail",
      message: "Following fields are required - " + message,
      response: [],
    });
  }
});
///////////////////////////////////////user login

router.post("/login", async (req, res) => {
  // * required array
  let required = [];

  if (!req.body.email) required.push("email");
  if (!req.body.password) required.push("password");

  if (required.length === 0) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "No account with this email has been registered." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials." });

      const token = jwt.sign(
        { id: user._id },
        "shhhhhhh its my secret ...... ... .. .",
        { expiresIn: "1h" }
      );
      res.json({
        token,
        user: {
          id: user._id,
          displayName: user.displayName,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // * mapping the required array list
    let message = required.map((item) => {
      return " " + item;
    });
    return res.status(400).json({
      status: "fail",
      message: "Following fields are required - " + message,
      response: [],
    });
  }
});

//////////////////////////////////////check auth token

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(
      token,
      "shhhhhhh its my secret ...... ... .. ."
    );
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/////////////////////////////////////delete user
router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//////////////////////////////////// get details of the user

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});

/////////////////////////////

module.exports = router;
