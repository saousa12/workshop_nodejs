const express = require("express");
var router = express.Router();
const productSchema = require("../models/product");
const orderSchema = require("../models/order");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const { authToken } = require("../middleware/auth");

router.get("/", authToken, async function (req, res, next) {
  try {
    const userId = req.user._id;
    let products = await productSchema.find({ createdBy: userId });
    if (!products) {
      return res
        .status(200)
        .send({ status: 200, message: "No order found", data: [] });
    }

    await res.status(200).send({
      status: 200,
      message: "success",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
});

router.get("/:id", authToken, async function (req, res, next) {
  const { id } = req.params;
  try {
    let product = await productSchema.findById(id);
    if (!product) {
      return res.status(400).send({
        status: 400,
        message: "Product not found",
        data: [],
      });
    }

    await res.status(200).send({
      status: 200,
      message: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// create product
router.post("/", authToken, async function (req, res, next) {
  const { productName, category, description, price, stock, createdBy } =
    req.body;
  try {
    let product = await productSchema.create({
      productName,
      category,
      description,
      price,
      stock,
      createdBy: req.user._id,
    });
    res
      .status(201)
      .send({ status: 201, message: "Create success", data: product });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", authToken, async function (req, res, next) {
  const { id } = req.params;
  const { productName, category, description, price, stock } = req.body;
  try {
    let product = await productSchema.findByIdAndUpdate(id, {
      productName,
      category,
      description,
      price,
      stock,
    });

    if (!product) {
      res
        .status(400)
        .send({ status: 400, massage: "Product not found", data: [] });
    }

    await res
      .status(200)
      .send({ status: 200, message: "Update success", data: product });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", authToken, async function (req, res, next) {
  const { id } = req.params;
  try {
    let product = await productSchema.findByIdAndDelete(id);
    if (!product) {
      res.status(400).send({ status: 400, massage: "Product not found" });
    }

    await res
      .status(200)
      .send({ status: 200, message: "Delete success.", data: [] });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//create order
router.post("/:id/orders", authToken, async function (req, res, next) {
  const { id } = req.params;
  const { productId, amount, userId } = req.body;
  try {
    let product = await productSchema.findById(id);
    if (!product) {
      res
        .status(400)
        .send({ status: 400, massage: "product not found", data: [] });
    }
    console.log(product.stock);
    console.log(amount);

    if (amount <= 0) {
      return res
        .status(400)
        .send({ status: 400, message: "Amount must be greater than zero" });
    }

    if (product.stock == 0 || amount > product.stock) {
      return res.status(400).send({
        status: 400,
        message: "Not enough stock",
        data: [],
      });
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).send({
        status: 401,
        message: "You do not have permission to order this product",
      });
    }

    const userId = req.user._id;
    console.log(typeof id);

    let newOrder = await orderSchema.create({
      userId: userId,
      productId: id,
      amount,
    });

    product.stock -= amount;
    await product.save();

    res.status(201).send({
      status: 201,
      message: "Order success",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id/orders", authToken, async function (req, res, next) {
  const { id } = req.params;
  try {
    let order = await orderSchema.find({ productId: id });
    if (!order) {
      return res.status(400).send({
        status: 400,
        message: "Order not found",
        data: [],
      });
    }

    await res.status(200).send({
      status: 200,
      message: "success",
      data: order,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
