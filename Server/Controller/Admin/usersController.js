const { connectDB, sql } = require("../../MiddleWare/connectToDB.js");
const generateError = require("../../MiddleWare/generateError.js");
const handleRes = require("../../MiddleWare/handleRes.js");
const asyncWrapper = require("../../MiddleWare/errorHandling.js");
const { SUCCESS, FAIL } = require("../../MiddleWare/handleResStatus.js");
const bcrypt = require("bcryptjs");
const generateJWT = require("../../MiddleWare/generateJWT.js");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();
  const result = await pool.request().query("select * from users");
  const data = result.recordset;
  if (data.length === 0)
    return next(generateError("no data to show", 200, FAIL));

  handleRes(res, 200, SUCCESS, data);
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id", userId)
    .query("SELECT * FROM users WHERE id = @id");

  const data = result.recordset;

  if (data.length === 0)
    return next(generateError("User not found", 404, FAIL));

  handleRes(res, 200, SUCCESS, data);
});

const updateUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  const pool = await connectDB();

  let updates = [];
  if (first_name) updates.push(`first_name = @first_name`);
  if (last_name) updates.push(`last_name = @last_name`);
  if (email) updates.push(`email = @email`);
  if (phone) updates.push(`phone = @phone`);
  if (updates.length === 0)
    return next(generateError("No fields to update", 400, FAIL));

  const sqlQuery = `
        UPDATE users 
        SET ${updates.join(", ")} 
        WHERE id = @id;
    `;

  const request = pool.request().input("id", sql.Int, userId);

  if (first_name) request.input("first_name", sql.VarChar, first_name);
  if (last_name) request.input("last_name", sql.VarChar, last_name);
  if (email) request.input("email", sql.VarChar, email);
  if (phone) request.input("phone", sql.VarChar, phone);

  const result = await request.query(sqlQuery);

  handleRes(res, 201, SUCCESS, "User updated successfully");
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const pool = await connectDB();

  const checkUser = await pool
    .request()
    .input("id", userId)
    .query("SELECT * FROM users WHERE id = @id");
  if (checkUser.recordset.length == 0)
    return next(generateError("this user already not exist", 404, FAIL));

  const result = await pool
    .request()
    .input("id", userId)
    .query("DELETE FROM users WHERE id = @id");

  handleRes(res, 201, SUCCESS, "User deleted successfully");
});

module.exports = {
  getAllUsers,
  getSingleUser,
   updateUser,
   deleteUser,
};
