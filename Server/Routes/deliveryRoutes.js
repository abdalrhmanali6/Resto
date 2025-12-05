const express = require("express");
const Router = express.Router();
const Delivery = require("../Controller/Delivery");
const verifyToken = require('../MiddleWare/verifyToken');
const Login = require('../Authentication/logIn');

Router.route("/login").post(Login);


Router.route("/:delivery_id")
  .get(verifyToken, Delivery.showOrders)
  .post(verifyToken,Delivery.completeOrder);



module.exports=Router;