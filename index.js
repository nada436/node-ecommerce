import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/database_connection.js";
import { errorHandler } from "./src/midleware/errorHandler.middleware.js";
import { user_routes } from "./src/modules/user/user.controller.js";
import cookieParser from "cookie-parser";
import { product_routes } from "./src/modules/products/product.controller.js";
import { category_routes } from "./src/modules/categories/category.controller.js";
import { rating_routes } from "./src/modules/Ratings/rating.controller.js";
import { cart_routes } from "./src/modules/cart/cart.controller.js";

import { payment_routes } from "./src/modules/payment/payment.controller.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/api/user", user_routes);
app.use("/api/products", product_routes);
app.use("/api/categories", category_routes);
app.use("/api/products", rating_routes);
app.use("/api/cart", cart_routes);
app.use("/api/payment", payment_routes);
app.use(errorHandler);
console.log("payment_routes:", payment_routes);

// add this in index.js temporarily
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// add this after all routes
app._router?.stack?.forEach((r) => {
  if (r.route) console.log(r.route.path);
  if (r.handle && r.handle.stack) {
    r.handle.stack.forEach((h) => {
      if (h.route) console.log(h.route.path);
    });
  }
});
app.listen(port, () => console.log(`Server running on port ${port}!`));
