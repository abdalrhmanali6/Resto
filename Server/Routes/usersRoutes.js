const express = require("express");
const Router = express.Router();

const verifyToken = require("../MiddleWare/verifyToken");
const User = require("../Controller/Admin/usersController");
const LogIn = require("../Authentication/logIn");
const Register = require("../Authentication/register");

Router.route("/login").post(LogIn);

Router.route("/register").post(Register);

module.exports = Router;
