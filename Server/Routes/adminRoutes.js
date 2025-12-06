const express = require("express");
const Router = express.Router();
const verifyToken = require("../MiddleWare/verifyToken");
const User = require("../Controller/Admin/usersController");
const Role = require("../Controller/Admin/roleController");
const Delivery = require("../Controller/Admin/deliveryController");
const Product = require("../Controller/Admin/productController");
const Order = require("../Controller/Admin/orderController");
const LogIn = require("../Authentication/logIn");
const Register = require("../Authentication/register");

//Routes for registration

Router.route("/login").post(LogIn);

Router.route("/register").post(Register);

//Routes for users

Router.route("/users").get(User.getAllUsers);

Router.route("/users/:userId")
    .get(verifyToken, User.getSingleUser)
    .patch(verifyToken, User.updateUser)
    .delete(verifyToken, User.deleteUser);

//Routes for roles

Router.route("/roles").get(Role.getAllRoles).post(Role.addRole);

Router.route("/roles/:roleId")
    .get(verifyToken, Role.getSingleRole)
    .patch(verifyToken, Role.updateRole)
    .delete(verifyToken, Role.deleteRole);

//Routes for products
Router.route("/products")
    .get(verifyToken, Product.getAllProducts)
    .post(verifyToken, Product.addProduct);

Router.route("/products/:productId")
    .get(verifyToken, Product.getSingleProduct)
    .patch(verifyToken, Product.updateProduct)
    .delete(verifyToken, Product.deleteProduct);

//Routes for deliveries
Router.route("/delivery")
    .get(verifyToken, Delivery.getAllDelivery)
    .post(verifyToken, Delivery.addDelivery);

Router.route("/delivery/:deliveryId")
    .get(verifyToken, Delivery.getSingleDelivery)
    .patch(verifyToken, Delivery.updateDelivery)
    .delete(verifyToken, Delivery.deleteDelivery);
<<<<<<< HEAD
=======
  





  Router.route("/orders").get(verifyToken, Order.getAllOrders);

  Router.route("/orders/:order_id").patch(
    verifyToken,
    Order.orderFromPreparingToReady
  );


>>>>>>> 761bed70e8c07ba9e078e2d2d34b90aae5561b90

module.exports = Router;
