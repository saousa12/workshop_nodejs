const express = require("express");
var router = express.Router();
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authToken } = require("../middleware/auth");

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await userSchema.findOne({ username });
    if (!user) {
      return res.status(400).send({
        status: 401,
        message: "Invalid username or password",
        data: [],
      });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).send({
    //     status: 400,
    //     message: "Invalid username or password",
    //     data: [],
    //   });
    // }

    if (password !== user.password) {
      res.status(401).send({
        status: 401,
        message: "Invalid username or password",
        data: [],
      });
    }
    //สร้าง payload
    const payload = {
      id: user._id,
      username: user.username,
      approve: user.approve,
    };

    // สร้าง JWT token
    const token = jwt.sign(payload, "your_jwt_secret");

    await res.status(200).send({
      status: 200,
      message: "Login success",
      data: { token },
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
});

router.post("/register", async function (req, res, next) {
  const { fname, lname, shopName, username, password } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let newUser = await userSchema.create({
      fname,
      lname,
      shopName,
      username,
      password,
      approve: null,
    });
    res.status(201).send({
      status: 201,
      message: "Create success",
      data: [newUser],
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/approve/:id", async function (req, res, next) {
  const { id } = req.params;
  const { approve } = req.body;
  try {
    await userSchema.findByIdAndUpdate(id, { approve });
    res.status(201).send("Approve success");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/", authToken, async function (req, res, next) {
  const { fname, lname, shopName, username, password } = req.body;
  try {
    let updateUser = await userSchema.findByIdAndUpdate(req.user._id, {
      fname,
      lname,
      shopName,
      username,
      password,
    });
    await res.status(200).send({
      status: 200,
      message: "Update success",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
