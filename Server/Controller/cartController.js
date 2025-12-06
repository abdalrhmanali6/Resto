const { connectDB, sql } = require("../MiddleWare/connectToDB");
const generateError = require("../MiddleWare/generateError");
const handleRes = require("../MiddleWare/handleRes");
const asyncWrapper = require("../MiddleWare/errorHandling");
const { FAIL, SUCCESS } = require("../MiddleWare/handleResStatus");

const showItemCart = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.params;
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("user_id", user_id)
    .query("select * from cart where user_id=@user_id");

  const data = result.recordset;
  if (data.length === 0)
    return next(generateError("not item on the Cart", 400, FAIL));
  let allData = [];
  for (item in data) {
    let totalPriceForSingleProduct = 0;
    const product_id = data[item].product_id;
    const product = await pool
      .request()
      .input("productId", product_id)
      .query(`SELECT name , price FROM products WHERE id = @productId;`);
    const productData = product.recordset;
    totalPriceForSingleProduct += data[item].quantity * productData[0].price;
    allData.push({
      ...data[item],
      ...productData[0],
      totalPriceForSingleProduct,
    });
  }


  handleRes(res, 200, SUCCESS, allData);
});

const addToCart = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();
  const { user_id } = req.params;

  let { product_id, quantity } = req.body;

  if (!product_id || !user_id)
    return next(generateError("product and user id required", 400, FAIL));

  const result = await pool
    .request()
    .input("productId", product_id)
    .query(`SELECT price FROM products WHERE id = @productId;`);

  const data = result.recordset;
  if (data.length === 0)
    return next(generateError("no product exist with this ID", 400, FAIL));

  let price = data[0].price;

  const exist = await pool
    .request()
    .input("userId", sql.Int, user_id)
    .input("productId", sql.Int, product_id).query(`
        SELECT quantity 
        FROM cart 
        WHERE user_id = @userId AND product_id = @productId
    `);

  if (exist.recordset.length > 0) {
    await pool
      .request()
      .input("userId", sql.Int, user_id)
      .input("productId", sql.Int, product_id)
      .input("newQty", sql.Int, quantity).query(`
          UPDATE cart
          SET quantity = @newQty
          WHERE user_id = @userId AND product_id = @productId
      `);

    return handleRes(res, 200, SUCCESS, {
      message: "Quantity increased",
      product_id,
      quantity,
      totalPrice: quantity * price,
    });
  }

  if (quantity == undefined) quantity = 1;

  await pool
    .request()
    .input("userId", sql.Int, user_id)
    .input("productId", sql.Int, product_id)
    .input("quantity", sql.Int, quantity).query(`
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (@userId, @productId, @quantity)
        `);

  let totalPrice = quantity * price;
  handleRes(res, 201, SUCCESS, { product_id, quantity, totalPrice });
});

const removeFromCart = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.params;

  let { product_id } = req.body;

  if (!product_id || !user_id)
    return next(generateError("product and user id required", 400, FAIL));
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("productId", product_id)
    .query(`SELECT price FROM products WHERE id = @productId;`);

  const data = result.recordset;
  if (data.length === 0)
    return next(generateError("no product exist with this ID", 400, FAIL));

  await pool.request().input("user_id", user_id).input("product_id", product_id)
    .query(`DELETE FROM cart
          WHERE user_id = @user_id AND product_id = @product_Id
                                `);

  handleRes(res, 201, SUCCESS, "this product deleted from cart");
});






module.exports = {
  addToCart,
  removeFromCart,
  showItemCart,
};
