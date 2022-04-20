const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { genKeyResult } = require("../util/gen-key");

const User = require("../model/User");

// router.post("/abc", async (req, res) => {
//   console.log(genKeyResult);
//   res.end();
// });

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    const user = await User.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });

    const hashedPassword = await argon2.hash(password);
    const { privateKey, publicKey } = genKeyResult;
    const newUser = new User({
      username,
      password: hashedPassword,
      devicePub: publicKey,
      devicePrv: privateKey,
    });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { teacherId: newUser.username },
      process.env.ACCESS_TOKEN
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
      privateKey,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username" });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    // Return token
    const accessToken = jwt.sign(
      { teacherId: user.username },
      process.env.ACCESS_TOKEN
    );

    res.json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      privateKey: user.devicePrv,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
