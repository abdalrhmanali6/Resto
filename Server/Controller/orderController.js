const { connectDB, sql } = require("../MiddleWare/connectToDB.js");
const generateError = require("../MiddleWare/generateError.js");
const handleRes = require("../MiddleWare/handleRes.js");
const { SUCCESS, FAIL } = require("../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../MiddleWare/errorHandling.js");


const setOrder=asyncWrapper(async(req,res,next)=>{

  const pool = await connectDB();


  const { user_id ,location } = req.body;

  if (!user_id || !location === undefined)
    return next(generateError("Missing required fields", 400, FAIL));

let delivery_fees =20;

  // 1) Get all cart items for user
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

  // 2) Calculate sub_total
  let sub_total = 0;
  cartItems.forEach((item) => {
    sub_total += item.price * item.quantity;
  });

     const result = await pool.request().query(`
        SELECT user_id
        FROM delivery_profiles
        WHERE status = 'ready'
        ORDER BY date_ready ASC
      `);
  
     if (result.recordset.length === 0)
       return next(generateError("No delivery ready at the moment try another time", 200, FAIL));

     let delivery_id = result.recordset[0];


  // 3) Insert into orders
  const orderResult = await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .input("delivery_id", sql.Int, delivery_id)
    .input("location", sql.VarChar, location)
    .input("sub_total", sql.Decimal(10, 2), sub_total)
    .input("delivery_fees", sql.Decimal(10, 2), delivery_fees)
    .input("status", sql.VarChar, "preparing").query(`
      INSERT INTO orders (user_id, delivery_id, location, sub_total, delivery_fees, status)
      OUTPUT INSERTED.id
      VALUES (@user_id, @delivery_id, @location, @sub_total, @delivery_fees, @status)
    `);

  const order_id = orderResult.recordset[0].id;

  // 4) Insert into order_item
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

  // 5) Clear cart
  await pool
    .request()
    .input("user_id", sql.Int, user_id)
    .query(`DELETE FROM cart WHERE user_id = @user_id`);
    
    
    
})


module.exports = { setOrder };