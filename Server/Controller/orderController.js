const { connectDB, sql } = require("../MiddleWare/connectToDB.js");
const generateError = require("../MiddleWare/generateError.js");
const { FAIL } = require("../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../MiddleWare/errorHandling.js");
const handleRes = require("../MiddleWare/handleRes.js");

const setOrder = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const { user_id } = req.params; // FIXED: Correct extraction
  const { location } = req.body;

  if (!user_id || location === undefined)
    return next(generateError("Missing required fields", 400, FAIL));

  const delivery_fees = 20;

  const userResult = await pool.request().input("user_id", sql.Int, user_id)
    .query(`
      SELECT first_name, last_name, phone
      FROM users
      WHERE id = @user_id
    `);

  if (userResult.recordset.length === 0)
    return next(generateError("User does not exist", 400, FAIL));

  const { first_name, last_name, phone } = userResult.recordset[0];

  const cartResult = await pool.request().input("user_id", sql.Int, user_id)
    .query(`
      SELECT c.product_id, c.quantity, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = @user_id
    `);

  const cartItems = cartResult.recordset;

  if (cartItems.length === 0)
    return next(generateError("Cart is empty", 400, FAIL));

  let sub_total = 0;
  cartItems.forEach((item) => {
    sub_total += item.price * item.quantity;
  });

  const deliveryResult = await pool.request().query(`
      SELECT user_id
      FROM delivery_profiles
      WHERE status = 'ready'
      ORDER BY date_ready ASC
  `);

  if (deliveryResult.recordset.length === 0)
    return next(
      generateError(
        "No delivery ready at the moment, try again later",
        200,
        FAIL
      )
    );

  const delivery_id = deliveryResult.recordset[0].user_id;

  const orderResult = await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .input("delivery_id", sql.Int, delivery_id)
    .input("location", sql.VarChar, location)
    .input("sub_total", sql.Decimal(10, 2), sub_total)
    .input("delivery_fees", sql.Decimal(10, 2), delivery_fees)
    .input("first_name", sql.VarChar, first_name)
    .input("last_name", sql.VarChar, last_name)
    .input("phone", sql.VarChar, phone)
    .input("status", sql.VarChar, "preparing").query(`
      INSERT INTO orders 
      (user_id, delivery_id, location, sub_total, delivery_fees, first_name, last_name, phone, status)
      OUTPUT INSERTED.id
      VALUES 
      (@user_id, @delivery_id, @location, @sub_total, @delivery_fees, @first_name, @last_name, @phone, @status)
    `);

  const order_id = orderResult.recordset[0].id;

  for (const item of cartItems) {
    await pool
      .request()
      .input("order_id", sql.Int, order_id)
      .input("product_id", sql.Int, item.product_id)
      .input("quantity", sql.Int, item.quantity).query(`
        INSERT INTO order_item (order_id, product_id, quantity)
        VALUES (@order_id, @product_id, @quantity)
      `);
  }

  await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .query(`DELETE FROM cart WHERE user_id = @user_id`);

  res.json({ success: true, message: "Order placed successfully", order_id });
});

const getAllOrdersByUser = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.params;

  const pool = await connectDB();

  const result = await pool.request().input("user_id", sql.Int, user_id).query(`
      SELECT 
        id AS order_id,
        user_id,
        location,
        status,
        date_placed,
        date_arrived,
      FROM orders
      WHERE user_id = @user_id
      ORDER BY created_at DESC
    `);

  if (result.recordset.length === 0)
    return next(generateError("No orders found", 200, FAIL));

  return handleRes(res, 200, SUCCESS, result.recordset);
});

const deleteOrder = asyncWrapper(async (req, res, next) => {
  const { orderId } = req.params;

  const pool = await connectDB();

  const check = await pool
    .request()
    .input("id", sql.Int, orderId)
    .query("SELECT * FROM orders WHERE id = @id");

  if (check.recordset.length === 0) {
    return next(generateError("This order does not exist", 404, FAIL));
  }

  await pool.request().input("id", sql.Int, orderId).query(`
      DELETE FROM orders WHERE id = @id
    `);

  return handleRes(res, 200, SUCCESS, "Order deleted successfully");
});

const followOrder = asyncWrapper(async (req, res, next) => {
  const { user_id, order_id } = req.body;

  const pool = await connectDB();

  const result = await pool.request().input("user_id", sql.Int, user_id).query(`
    SELECT id
    FROM orders
    WHERE user_id = @user_id
      AND status <> 'delivered'
  `);

  if (result.recordset.length === 0)
    return next(generateError("No waiting orders found", 200, FAIL));

  const result2 = await pool.request().input("order_id", sql.Int, order_id)
    .query(`
    SELECT status
    FROM orders
    WHERE order_id= @order_id
  `);

  return handleRes(res, 200, SUCCESS, result2.recordset[0].status);
});

module.exports = { setOrder, getAllOrdersByUser, deleteOrder, followOrder };
