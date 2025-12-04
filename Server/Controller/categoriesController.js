const { connectDB } = require("../MiddleWare/connectToDB.js");
const generateError = require("../MiddleWare/generateError.js");
const handleRes = require("../MiddleWare/handleRes.js");
const { SUCCESS, FAIL } = require("../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../MiddleWare/errorHandling.js");


const getAllCategories = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const result = await pool.request().query(`
    SELECT id, name
    FROM categories
  `);

  if (result.recordset.length === 0)
    return next(generateError("no categories to show", 200, FAIL));
  
  return handleRes(res, 200, SUCCESS, result.recordset);
});


module.exports = {
  getAllCategories,
};