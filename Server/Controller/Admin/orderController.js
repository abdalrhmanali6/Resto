const { connectDB } = require("../../MiddleWare/connectToDB");
const generateError = require("../../MiddleWare/generateError");
const handleRes = require("../../MiddleWare/handleRes");
const { FAIL, SUCCESS } = require("../../MiddleWare/handleResStatus");
const asyncWrapper = require('../../MiddleWare/errorHandling');

const getAllOrders = asyncWrapper(async (req, res, next) => {

  const pool = await connectDB();

  const result = await pool.request().query(`
      SELECT 
      *
      FROM orders
      ORDER BY date_placed DESC
    `);

  if (result.recordset.length === 0)
    return next(generateError("No orders found", 200, FAIL));

  return handleRes(res, 200, SUCCESS, result.recordset);
});

const orderFromPreparingToReady = asyncWrapper(async (req, res, next) => {
  const id = req.params;
  const pool = await connectDB();


  const order_id = id.order_id;
  
  
  const checkOrder = await pool.request().input("order_id", order_id)
    .query(`SELECT 
  status
  FROM orders
WHERE id = @order_id;
`);

  if (checkOrder.recordset.length == 0)
    return next(generateError("no order with this id", 404, FAIL));

  if (checkOrder.recordset[0].status == "ready")
    return next(generateError("this order is ready already", 400, FAIL));

  const updateStatus = await pool.request().input("order_id", order_id)
    .query(`UPDATE orders
SET status = 'ready'
WHERE id = @order_id
  AND status = 'preparing';
`);

  return handleRes(res, 200, SUCCESS, "status updated to ready");
});


module.exports = { getAllOrders, orderFromPreparingToReady };