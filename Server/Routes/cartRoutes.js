const express = require("express");
const Router = express.Router();
const Cart = require("../Controller/cartController");
const verifyToken = require("../MiddleWare/verifyToken");

Router.route("/:user_id")
  .get(verifyToken, Cart.showItemCart)
  .post(verifyToken, Cart.addToCart)
  .delete(verifyToken,Cart.removeFromCart);

module.exports = Router;
