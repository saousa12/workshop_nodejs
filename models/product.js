const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, unique: true, required: true },
    image: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
