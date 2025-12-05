const { connectDB, sql } = require("../../MiddleWare/connectToDB.js");
const generateError = require("../../MiddleWare/generateError.js");
const handleRes = require("../../MiddleWare/handleRes.js");
const { SUCCESS, FAIL } = require("../../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../../MiddleWare/errorHandling.js");
const bcrypt = require("bcrypt");

const getAllDelivery = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const result = await pool.request().query(`
   SELECT 
  d.user_id,
  u.email,
  u.first_name,
  u.last_name,
  u.phone,
  u.gender,
  d.vehicle_type,
  d.license_plate,
  d.license_number,
  d.status,
  r.role_id
FROM delivery_profiles AS d
INNER JOIN users AS u 
  ON d.user_id = u.id
INNER JOIN user_roles AS r 
  ON d.user_id = r.user_id;
  `);

  if (result.recordset.length === 0)
    return next(generateError("no data to show", 200, FAIL));

  return handleRes(res, 200, SUCCESS, result.recordset);
});

const getSingleDelivery = asyncWrapper(async (req, res, next) => {
  const { deliveryId } = req.params;

  const pool = await connectDB();

  const result = await pool.request().input("id", sql.Int, deliveryId).query(`
      SELECT 
        d.user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.gender,
        d.vehicle_type,
        d.license_plate,
        d.license_number,
        d.status
      FROM delivery_profiles d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = @id
  `);

  const delivery = result.recordset[0];

  if (!delivery) return next(generateError("no data to show", 200, FAIL));

  return handleRes(res, 200, SUCCESS, delivery);
});

const addDelivery = asyncWrapper(async (req, res, next) => {
  const {
    email,
    password,
    first_name,
    last_name,
    gender,
    birth_date,
    phone,
    vehicle_type,
    license_plate,
    license_number,
    status,
  } = req.body;

  if (!email || !password)
    return next(generateError("email and password are required", 400, FAIL));

  const pool = await connectDB();

  const result = await pool.request().input("email", sql.VarChar, email).query(`
      SELECT 
        id
      FROM Users 
      WHERE email = @email
  `);

  if (result.recordset.length > 0)
    return next(generateError("sorry,this email in use", 400, FAIL));

  const hashedPassword = await bcrypt.hash(password, 10);

  const userInsert = await pool
    .request()
    .input("email", sql.VarChar, email)
    .input("password", sql.VarChar, hashedPassword)
    .input("first_name", sql.VarChar, first_name)
    .input("last_name", sql.VarChar, last_name)
    .input("gender", sql.VarChar, gender)
    .input("birth_date", sql.Date, birth_date)
    .input("phone", sql.VarChar, phone).query(`
        INSERT INTO users (email, password, first_name, last_name, gender, birth_date, phone)
        OUTPUT INSERTED.id
        VALUES (@email, @password, @first_name, @last_name, @gender, @birth_date, @phone)
      `);

  const newUserId = userInsert.recordset[0].id;

  await pool
    .request()
    .input("user_id", sql.Int, newUserId)
    .input("vehicle_type", sql.VarChar, vehicle_type)
    .input("license_plate", sql.VarChar, license_plate)
    .input("license_number", sql.VarChar, license_number)
    .input("status", sql.VarChar, status).query(`
        INSERT INTO delivery_profiles (user_id, vehicle_type, license_plate, license_number, status)
        VALUES (@user_id, @vehicle_type, @license_plate, @license_number, @status)
      `);

  const getRoleId = await pool.request().input("name", sql.VarChar, "DELIVERY")
    .query(`
        SELECT id 
        FROM roles 
        WHERE name = @name
    `);

  const roleId = getRoleId.recordset[0].id;
  console.log(roleId);

  await pool
    .request()
    .input("userId", sql.Int, newUserId)
    .input("roleId", sql.Int, roleId)
    .query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (@userId, @roleId)"
    );

  return handleRes(res, 201, SUCCESS, "delivery profile created successfully", {
    user_id: newUserId,
  });
});

const updateDelivery = asyncWrapper(async (req, res, next) => {
  const { deliveryId } = req.params;

  const { vehicle_type, license_plate, license_number, status } = req.body;

  const { first_name, last_name, phone, gender, email } = req.body;

  const { role_id } = req.body;

  const pool = await connectDB();

  const check = await pool
    .request()
    .input("id", sql.Int, deliveryId)
    .query("SELECT * FROM delivery_profiles WHERE user_id = @id");

  if (check.recordset.length === 0)
    return next(generateError("delivery profile not exist", 404, FAIL));

  let deliveryUpdates = [];
  if (vehicle_type) deliveryUpdates.push("vehicle_type = @vehicle_type");
  if (license_plate) deliveryUpdates.push("license_plate = @license_plate");
  if (license_number) deliveryUpdates.push("license_number = @license_number");
  if (status) deliveryUpdates.push("status = @status");

  let userUpdates = [];
  if (first_name) userUpdates.push("first_name = @first_name");
  if (last_name) userUpdates.push("last_name = @last_name");
  if (phone) userUpdates.push("phone = @phone");
  if (gender) userUpdates.push("gender = @gender");
  if (email) userUpdates.push("email = @email");

  if (deliveryUpdates.length === 0 && userUpdates.length === 0 && !role_id) {
    return next(generateError("No fields to update", 400, FAIL));
  }

  const request = pool.request().input("id", sql.Int, deliveryId);

  if (vehicle_type) request.input("vehicle_type", sql.VarChar, vehicle_type);
  if (license_plate) request.input("license_plate", sql.VarChar, license_plate);
  if (license_number)
    request.input("license_number", sql.VarChar, license_number);
  if (status) request.input("status", sql.VarChar, status);

  if (first_name) request.input("first_name", sql.VarChar, first_name);
  if (last_name) request.input("last_name", sql.VarChar, last_name);
  if (phone) request.input("phone", sql.VarChar, phone);
  if (gender) request.input("gender", sql.VarChar, gender);
  if (email) request.input("email", sql.VarChar, email);

  if (role_id) request.input("role_id", sql.Int, role_id);

  let finalQuery = "";

  if (deliveryUpdates.length > 0) {
    finalQuery += `
      UPDATE delivery_profiles
      SET ${deliveryUpdates.join(", ")}
      WHERE user_id = @id;
    `;
  }

  if (userUpdates.length > 0) {
    finalQuery += `
      UPDATE users
      SET ${userUpdates.join(", ")}
      WHERE id = @id;
    `;
  }

  if (role_id) {
    finalQuery += `
      UPDATE user_roles
      SET role_id = @role_id
      WHERE user_id = @id;
    `;
  }

  await request.query(finalQuery);

  return handleRes(res, 200, SUCCESS, "Delivery updated successfully");
});



const deleteDelivery = asyncWrapper(async (req, res, next) => {
  const { deliveryId } = req.params;

  const pool = await connectDB();

  const check = await pool
    .request()
    .input("id", sql.Int, deliveryId)
    .query("SELECT * FROM delivery_profiles WHERE user_id = @id");

  if (check.recordset.length === 0) {
    return next(
      generateError("This delivery profile does not exist", 404, FAIL)
    );
  }

  await pool.request().input("id", sql.Int, deliveryId).query(`
      DELETE FROM users WHERE id = @id
    `);

  return handleRes(res, 200, SUCCESS, "Delivery deleted successfully");
});


module.exports = {
  getAllDelivery,
  getSingleDelivery,
  addDelivery,
  updateDelivery,
  deleteDelivery,
};
