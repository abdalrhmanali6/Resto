const { connectDB, sql } = require("../../MiddleWare/connectToDB.js");
const generateError = require("../../MiddleWare/generateError.js");
const handleRes = require("../../MiddleWare/handleRes.js");
const { SUCCESS, FAIL } = require("../../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../../MiddleWare/errorHandling.js");

const getAllDelivery = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const result = await pool.request().query(`
      SELECT 
        d.user_id,
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
  const { user_id, vehicle_type, license_plate, license_number, status } =
    req.body;

  if (!user_id) return next(generateError("user_id is required", 400, FAIL));

  const pool = await connectDB();

  await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .input("vehicle_type", sql.VarChar, vehicle_type)
    .input("license_plate", sql.VarChar, license_plate)
    .input("license_number", sql.VarChar, license_number)
    .input("status", sql.VarChar, status).query(`
      INSERT INTO delivery_profiles (user_id, vehicle_type, license_plate, license_number, status)
      VALUES (@user_id, @vehicle_type, @license_plate, @license_number, @status)
  `);

  return handleRes(res, 201, SUCCESS, "Delivery profile created successfully");
});


const updateDelivery = asyncWrapper(async (req, res, next) => {
  const { deliveryId } = req.params;
  const { vehicle_type, license_plate, license_number, status } = req.body;

  const pool = await connectDB();


  const check = await pool
    .request()
    .input("id", sql.Int, deliveryId)
    .query("SELECT * FROM delivery_profiles WHERE user_id = @id");

  if (check.recordset.length === 0)
    return next(generateError("delivery profile not exist", 404, FAIL));

  let updates = [];
  if (vehicle_type) updates.push("vehicle_type = @vehicle_type");
  if (license_plate) updates.push("license_plate = @license_plate");
  if (license_number) updates.push("license_number = @license_number");
  if (status) updates.push("status = @status");

  if (updates.length === 0)
    return next(generateError("No fields to update", 400, FAIL));

  const sqlQuery = `
      UPDATE delivery_profiles
      SET ${updates.join(", ")}
      WHERE user_id = @id
  `;

  const request = pool.request().input("id", sql.Int, deliveryId);

  if (vehicle_type) request.input("vehicle_type", sql.VarChar, vehicle_type);
  if (license_plate) request.input("license_plate", sql.VarChar, license_plate);
  if (license_number)
    request.input("license_number", sql.VarChar, license_number);
  if (status) request.input("status", sql.VarChar, status);

  await request.query(sqlQuery);

  return handleRes(res, 200, SUCCESS, "delivery profile updated successfully");
});

const deleteDelivery = asyncWrapper(async (req, res, next) => {
  const { deliveryId } = req.params;

  const pool = await connectDB();

  const check = await pool
    .request()
    .input("id", sql.Int, deliveryId)
    .query("SELECT * FROM delivery_profiles WHERE user_id = @id");

  if (check.recordset.length === 0)
    return next(
      generateError("This delivery profile does not exist", 404, FAIL)
    );

  await pool
    .request()
    .input("id", sql.Int, deliveryId)
    .query("DELETE FROM delivery_profiles WHERE user_id = @id");

  return handleRes(res, 201, SUCCESS, "delivery profile deleted successfully");
});





module.exports = {
  getAllDelivery,
  getSingleDelivery,
  addDelivery,
  updateDelivery,
  deleteDelivery,
};
