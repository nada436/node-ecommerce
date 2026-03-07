import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByID,
  updateCategory,
} from "./category.service.js";

export const category_routes = Router();
category_routes.get("/", getAllCategories);
category_routes.post("/", createCategory);

category_routes.get("/:id", getCategoryByID);
category_routes.patch("/:id", updateCategory);

category_routes.delete("/:id", deleteCategory);
