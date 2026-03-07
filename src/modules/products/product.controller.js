import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.service.js";

export const product_routes = Router();

product_routes.get("/", getAllProducts);
product_routes.post("/", createProduct);
product_routes.patch("/:id", updateProduct);
product_routes.delete("/:id", deleteProduct);
