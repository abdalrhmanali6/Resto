const { Issuer } = require("openid-client");
require('dotenv').config();
// 1. Discover Google OAuth server config & create client
async function setupClient() {
  const googleIssuer = await Issuer.discover("https://accounts.google.com");

  const client = new googleIssuer.Client({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [process.env.REDIRECT_URIS],
    response_types: ["code"],
  });
  return client;
}

// 2. Sign in route
const signInWithGoogle = async (req, res) => {
  const client = await setupClient();
  if (!client) {
    return res.status(500).send("OAuth client not initialized yet");
  }

  const url = client.authorizationUrl({
    scope: "openid email profile ", // request identity + email + profile
  });

  res.redirect(url);
};



const test = asyncWrapper(async(req,res,next)=>{

    const params = client.callbackParams(req);
    const tokenSet = await client.callback(process.env.GOOGLE_REDIRECT, params);

    const user = tokenSet.claims(); // email, name, picture

    // Check if user exists
    const pool = await connectDB()
    const checkUser = await pool.request()
      .input("email", sql.VarChar, user.email)
      .query("SELECT * FROM Users WHERE email = @email");

    // If new user → register
    if (checkUser.recordset.length === 0) {
      await pool.request()
        .input("name", sql.VarChar, user.name)
        .input("email", sql.VarChar, user.email)
        .query("INSERT INTO Users (name, email) VALUES (@name, @email)");
    }

    return res.json({
      message: "Google login success",
      user
    });

  });
  
  
  


module.exports = {
  setupClient,
  signInWithGoogle,
};
