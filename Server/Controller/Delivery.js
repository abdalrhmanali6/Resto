const { connectDB, sql } = require("../MiddleWare/connectToDB");
const generateError = require("../MiddleWare/generateError");
const handleRes = require("../MiddleWare/handleRes");
const { SUCCESS, FAIL } = require("../MiddleWare/handleResStatus");
const asyncWrapper = require('../MiddleWare/errorHandling');
const showOrders = asyncWrapper(async (req, res, next) => {

  const { delivery_id } = req.params; // from URL

  const pool = await connectDB();

  const result = await pool.request().input("delivery_id", sql.Int, delivery_id)
    .query(`
    SELECT 
        o.id AS order_id,
        o.delivery_id,
        o.location,
        o.date_placed,
        o.sub_total,
        o.delivery_fees,
        o.total_price,

        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        oi.quantity

    FROM orders o
    JOIN order_item oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id

    WHERE o.id = (
        SELECT TOP 1 id
        FROM orders
        WHERE delivery_id = @delivery_id
          AND status = 'ready'
        ORDER BY date_placed DESC
);

    `);

  let order = result.recordset;
  let order_id = order[0].id;
  if (order.length == 0)
    return next(generateError("No orders yet", 400, SUCCESS));

  // 2) Update delivery profile to busy
  await pool.request().input("delivery_id", sql.Int, delivery_id).query(`
      UPDATE delivery_profiles
      SET status = 'busy'
      WHERE user_id = @delivery_id
    `);

  // 3) Update order status to on_the_way
  await pool.request().input("order_id", sql.Int, order_id).query(`
      UPDATE orders
      SET status = 'on_the_way'
      WHERE id = @order_id
    `);

  return handleRes(res, 200, SUCCESS, order);
});

const completeOrder = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const { delivery_id } = req.params; // from URL

  const result = await pool.request().input("delivery_id", sql.Int, delivery_id)
    .query(`
      SELECT top 1
        id
      FROM orders
      WHERE delivery_id = @delivery_id
                AND status = 'on_the_way'

      ORDER BY date_placed DESC
    `);

  let order = result.recordset;
  let order_id = order[0].id;

  // 3) Update order status to delivered
  await pool.request().input("order_id", sql.Int, order_id).query(`
      UPDATE orders
      SET status = 'delivered'
      WHERE id = @order_id
    `);



  return handleRes(res, 200, SUCCESS, "order completed successfully");
});

module.exports = { showOrders, completeOrder };
