const { connectDB, sql } = require("../../MiddleWare/connectToDB.js");
const generateError = require("../../MiddleWare/generateError.js");
const handleRes = require("../../MiddleWare/handleRes.js");
const { SUCCESS, FAIL } = require("../../MiddleWare/handleResStatus.js");
const asyncWrapper = require("../../MiddleWare/errorHandling.js");

const getAllRoles = asyncWrapper(async (req, res, next) => {
  const pool = await connectDB();

  const result = await pool.request().query(`
        SELECT id, name
        FROM roles
    `);

  if (result.recordset.length === 0)
    return next(generateError("no data to show", 200, FAIL));

  return handleRes(res, 200, SUCCESS, result.recordset);
});

const getSingleRole = asyncWrapper(async (req, res, next) => {
  const { roleId } = req.params;

  const pool = await connectDB();

  const result = await pool.request().input("id", sql.Int, roleId).query(`
        SELECT id, name 
        FROM roles 
        WHERE id = @id
    `);

  const role = result.recordset[0];

  if (!role) return next(generateError("no data to show", 200, FAIL));

  return handleRes(res, 200, SUCCESS, role);
});


const addRole = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;

  if (!name) return next(generateError("Role name is required", 400, FAIL));

  const pool = await connectDB();

  const result = await pool.request().input("name", sql.VarChar, name).query(`
        SELECT id, name 
        FROM roles 
        WHERE name = @name
    `);

    if(result.recordset.length!=0)
    return next(generateError("this role already exist  ", 400, FAIL));
    



  await pool.request().input("name", sql.VarChar, name).query(`
        INSERT INTO roles (name)
        VALUES (@name)
    `);

  return handleRes(res, 201, SUCCESS, "Role created successfully");
});

const updateRole = asyncWrapper(async (req, res, next) => {
  const { roleId } = req.params;
  const { name } = req.body;

  if (!name) return next(generateError("No fields to update", 400, FAIL));

  const pool = await connectDB();

  const checkRole = await pool
    .request()
    .input("id", sql.Int, roleId)
    .query("SELECT * FROM roles WHERE id = @id");

  if (checkRole.recordset.length === 0)
    return next(generateError("Role does not exist", 404, FAIL));

  await pool
    .request()
    .input("id", sql.Int, roleId)
    .input("name", sql.VarChar, name).query(`
        UPDATE roles 
        SET name = @name
        WHERE id = @id
    `);

  return handleRes(res, 200, SUCCESS, "Role updated successfully");
});


const deleteRole = asyncWrapper(async (req, res, next) => {
  const { roleId } = req.params;

  const pool = await connectDB();

  const checkRole = await pool
    .request()
    .input("id", sql.Int, roleId)
    .query("SELECT * FROM roles WHERE id = @id");

  if (checkRole.recordset.length === 0)
    return next(generateError("This role does not exist", 404, FAIL));

  await pool.request().input("id", sql.Int, roleId).query(`
        DELETE FROM roles WHERE id = @id
    `);

  return handleRes(res, 201, SUCCESS, "Role deleted successfully");
});


module.exports = {
  getAllRoles,
  getSingleRole,
  addRole,
  updateRole,
  deleteRole,
};
