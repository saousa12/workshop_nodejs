const { Mongoose, default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: { type: String },
    amount: { type: Number, required: true },
    userId: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
