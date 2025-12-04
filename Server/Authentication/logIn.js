const { connectDB, sql } = require("../MiddleWare/connectToDB.js");
const generateError = require("../MiddleWare/generateError.js");
const handleRes = require("../MiddleWare/handleRes.js");
const asyncWrapper = require("../MiddleWare/errorHandling.js");
const { SUCCESS, FAIL } = require("../MiddleWare/handleResStatus.js");
const bcrypt = require("bcryptjs");
const generateJWT = require("../MiddleWare/generateJWT.js");

const logIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const pool = await connectDB();
  if (!email || !password)
    return next(generateError("Email and Password are required", 400, FAIL));

  const result = await pool.request().input("email", email).query(`SELECT 
    u.id,
    u.email,
    u.password,
    r.name AS role
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = @email;
`);

  const data = result.recordset;

  if (data.length === 0)
    return next(generateError("no user with this email", 404, FAIL));

  console.log(data[0].password);
  console.log(data[0].role);

  const matchedPassword = await bcrypt.compare(password, data[0].password);
  const role = data[0].role;
  if (!matchedPassword) return next(generateError("Wrong Password", 404, FAIL));
  const token = await generateJWT({ email: email, role: role });

  handleRes(res, 200, SUCCESS, token);
});



module.exports = logIn;