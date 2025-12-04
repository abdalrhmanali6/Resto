const express = require("express");
const Router = express.Router();
const Delivery = require("../Controller/Delivery");
const verifyToken = require('../MiddleWare/verifyToken');
Router.route("/:delivery_id")
  .get(verifyToken, Delivery.showOrders)
  .post(verifyToken,Delivery.completeOrder);



module.exports=Router;