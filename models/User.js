const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// Load env variables
dotenv.config({ path: "./config/config.env" });
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 30,
    unique: [true, "username must be unique"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ["user", "admin"]
  },
  favourites: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      }
    }
  ],
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      },
      totalPrice: Number,
      numberOfItems: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

schema.methods.genJwt = function() {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role
    },
    process.env.JWTSECRET
  );
};

const User = mongoose.model("User", schema);

const validate = function(user) {
  const schema = {
    username: Joi.string()
      .required()
      .min(4)
      .max(30),
    password: new PasswordComplexity({
      min: 6,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirmentCount: 3
    }),
    avatar: Joi.string().allow(""),
    role: Joi.string().valid("user", "admin")
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validate;
