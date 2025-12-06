const express = require("express");
const cors = require("cors");
const { ERROR } = require("./MiddleWare/errorHandling");
const adminRouter = require("./Routes/adminRoutes");
const productRouter = require("./Routes/productRoutes");
const usersRouter = require("./Routes/usersRoutes");
const deliveryRouter = require("./Routes/deliveryRoutes");
const cartRouter = require("./Routes/cartRoutes");
const generateError = require("./MiddleWare/generateError");
require("dotenv").config();
const app = express();

console.log();

app.use(express.json());
app.use(cors());

app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter);
app.use("/delivery", deliveryRouter);

app.use((req, res, next) => {
    next(generateError("Page not found", 404, ERROR));
});

app.use((err, req, res, next) => {
    return res
        .status(err.statusCode || 500)
        .json({ state: err.errorState || ERROR, message: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
