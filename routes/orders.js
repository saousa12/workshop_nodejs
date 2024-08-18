const express = require("express");
var router = express.Router();
const orderSchema = require("../models/order");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");
const { authToken } = require("../middleware/auth");

router.get("/orders", authToken, async function (req, res, next) {
  try {
    const userId = req.user._id;
    const orders = await orderSchema.find({ userId: userId });
    console.log(orders);

    if (orders.length === 0) {
      return res
        .status(200)
        .send({ status: 200, message: "No order found", data: [] });
    }

    res.status(200).send({
      status: 200,
      message: "Order success",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
      data: [],
    });
  }
});

router.delete("/orders/:id", authToken, async function (req, res, next) {
  const { id } = req.params;
  try {
    let order = await orderSchema.findByIdAndDelete(id);
    if (!order) {
      res.status(400).send({ status: 400, massage: "Order not found" });
    }

    await res.status(200).send({ status: 200, message: "Delete success." });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
module.exports = router;
