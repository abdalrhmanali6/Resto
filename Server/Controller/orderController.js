const { connectDB, sql } = require("../MiddleWare/connectToDB.js");
const generateError = require("../MiddleWare/generateError.js");
const { FAIL, SUCCESS } = require("../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../MiddleWare/errorHandling.js");
const handleRes = require("../MiddleWare/handleRes.js");

// POST /order/:user_id
const setOrder = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const { user_id } = req.params;
  const { location } = req.body;

  if (!user_id || location === undefined) {
    return next(generateError("Missing required fields", 400, FAIL));
  }

  const delivery_fees = 20;

  // get user data (users table has first_name, last_name, phone)
  const userResult = await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .query(`
      SELECT first_name, last_name, phone
      FROM users
      WHERE id = @user_id
    `);

  if (userResult.recordset.length === 0) {
    return next(generateError("User does not exist", 400, FAIL));
  }

  const { first_name, last_name, phone } = userResult.recordset[0];

  // get cart items with prices
  const cartResult = await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .query(`
      SELECT c.product_id, c.quantity, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = @user_id
    `);

  const cartItems = cartResult.recordset;

  if (cartItems.length === 0) {
    return next(generateError("Cart is empty", 400, FAIL));
  }

  // calculate subtotal
  let sub_total = 0;
  cartItems.forEach((item) => {
    sub_total += item.price * item.quantity;
  });

  // choose first ready delivery (delivery_profiles has no date_placed, so no ORDER BY on it)
  const deliveryResult = await pool.request().query(`
    SELECT user_id
    FROM delivery_profiles
    WHERE status = 'ready'
  `);

  if (deliveryResult.recordset.length === 0) {
    return next(
      generateError(
        "No delivery ready at the moment, try again later",
        200,
        FAIL
      )
    );
  }

  const delivery_id = deliveryResult.recordset[0].user_id;

  // orders table: id, user_id, delivery_id, location, date_placed, date_arrived,
  // sub_total, total_price, delivery_fees, status, rating
  const total_price = sub_total + delivery_fees;

  const orderResult = await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .input("delivery_id", sql.Int, delivery_id)
    .input("location", sql.VarChar, location)
    .input("sub_total", sql.Decimal(10, 2), sub_total)
    .input("total_price", sql.Decimal(10, 2), total_price)
    .input("delivery_fees", sql.Decimal(10, 2), delivery_fees)
    .input("status", sql.VarChar, "preparing")
    .query(`
      INSERT INTO orders
        (user_id, delivery_id, location, sub_total, total_price, delivery_fees, status)
      OUTPUT INSERTED.id
      VALUES
        (@user_id, @delivery_id, @location, @sub_total, @total_price, @delivery_fees, @status)
    `);

  const order_id = orderResult.recordset[0].id;

  // create order_item rows
  for (const item of cartItems) {
    await pool
      .request()
      .input("order_id", sql.Int, order_id)
      .input("product_id", sql.Int, item.product_id)
      .input("quantity", sql.Int, item.quantity)
      .query(`
        INSERT INTO order_item (order_id, product_id, quantity)
        VALUES (@order_id, @product_id, @quantity)
      `);
  }

  // clear cart
  await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .query(`DELETE FROM cart WHERE user_id = @user_id`);

  res.json({
    success: true,
    message: "Order placed successfully",
    order_id,
    first_name,
    last_name,
    phone,
    sub_total,
    delivery_fees,
    total_price,
  });
});

// GET /order/:user_id
const getAllOrdersByUser = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.params;
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .query(`
      SELECT
        id AS order_id,
        user_id,
        delivery_id,
        location,
        sub_total,
        total_price,
        delivery_fees,
        status,
        date_placed
      FROM orders
      WHERE user_id = @user_id
      ORDER BY date_placed DESC
    `);

  if (result.recordset.length === 0) {
    return next(generateError("No orders found", 200, FAIL));
  }

  return handleRes(res, 200, SUCCESS, result.recordset);
});

module.exports = { setOrder, getAllOrdersByUser };

