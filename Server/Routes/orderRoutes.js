const express = require("express");
const Router = express.Router();
const Order = require("../Controller/orderController");
const verifyToken = require("../MiddleWare/verifyToken");



Router.route('/:user_id').post(Order.setOrder);