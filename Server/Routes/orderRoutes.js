const express = require("express");
const Router = express.Router();
const Order = require("../Controller/orderController");
const verifyToken = require("../MiddleWare/verifyToken");



Router.route("/").get(verifyToken, Order.followOrder);
Router.route("/:user_id").get(verifyToken, Order.getAllOrdersByUser);
Router.route("/:user_id").post(verifyToken, Order.setOrder);
Router.route("/:user_id").delete(verifyToken, Order.deleteOrder);
 
module.exports = Router;