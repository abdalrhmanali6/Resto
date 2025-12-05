const { connectDB, sql } = require("../MiddleWare/connectToDB.js");
const generateError = require("../MiddleWare/generateError.js");
const handleRes = require("../MiddleWare/handleRes.js");
const asyncWrapper = require("../MiddleWare/errorHandling.js");
const { SUCCESS, FAIL } = require("../MiddleWare/handleResStatus.js");
const bcrypt = require("bcryptjs");
const generateJWT = require("../MiddleWare/generateJWT.js");

const register = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();
  let {
    email,
    password,
    first_name,
    last_name,
    gender,
    birth_date,
    phone,
    role,
  } = req.body;

  const checkUser = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT id FROM users WHERE email = @email");

  if (checkUser.recordset.length > 0)
    return next(generateError("Email already exists", 400, FAIL));

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .input("password", sql.VarChar, hashedPassword)
    .input("first_name", sql.VarChar, first_name)
    .input("last_name", sql.VarChar, last_name)
    .input("gender", sql.VarChar, gender)
    .input("birth_date", sql.Date, birth_date)
    .input("phone", sql.VarChar, phone).query(`
      INSERT INTO users (email, password, first_name, last_name, gender, birth_date, phone)
      OUTPUT inserted.id
      VALUES (@email, @password, @first_name, @last_name, @gender, @birth_date, @phone)
    `);

  const userId = result.recordset[0].id;

  let RolesArray = ["ADMIN", "DELIVERY", "CUSTOMER"];
  if (!RolesArray.includes(role)) role = "CUSTOMER";
  let roleResult = await pool
    .request()
    .input("roleName", sql.VarChar, role)
    .query("SELECT id FROM roles WHERE name = @roleName");

  let roleId = roleResult.recordset[0].id;

  await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("roleId", sql.Int, roleId)
    .query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (@userId, @roleId)"
    );

  const token = await generateJWT({ email: email, role: role });

  handleRes(res, 201, SUCCESS, token);
});

module.exports= register;