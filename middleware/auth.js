const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

module.exports = function(req, res, next) {
  const token = req.header("x-jwt");
  if (!token) return res.status(401).send("You must be logged in first");

  try {
    const user = jwt.verify(token, config.get(process.env.JWTSECRET));
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send("Invalid authentication token");
  }
};
