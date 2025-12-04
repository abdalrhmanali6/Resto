const express = require("express");
const Router = express.Router();
const Product = require("../Controller/Admin/productController");
const Categories=require("../Controller/categoriesController")
const verifyToken = require("../MiddleWare/verifyToken");

Router.route("/")
  .get(Product.getAllProducts)
Router.route("/categories")
  .get(Categories.getAllCategories)
Router.route("/:productId")
  .get(verifyToken, Product.getSingleProduct)



module.exports = Router;
