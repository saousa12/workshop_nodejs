const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String },
    lname: { type: String },
    shopName: { type: String },
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    approve: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
