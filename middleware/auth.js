const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");

const middleware = {
  authToken: async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({
        status: 401,
        message: "No token provided",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        status: 401,
        message: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, "your_jwt_secret");
      const user = await userSchema.findById(decoded.id);

      if (!user) {
        return res.status(400).send({
          status: 400,
          message: "User not found",
        });
      }

      if (user.approve !== "approve") {
        return res.status(401).send({
          status: 401,
          message: "User not approved",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "Invalid token",
        error,
      });
    }
  },
};

module.exports = { ...middleware };
