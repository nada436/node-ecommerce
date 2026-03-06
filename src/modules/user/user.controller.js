import express, { Router } from "express";
import { catchAsync } from "../../midleware/errorHandler.middleware.js";
const app = express(); 
export const user_routes = Router(); 

user_routes.post("/signup",catchAsync())
user_routes.post("/login",catchAsync())
user_routes.get("/:id",catchAsync())
user_routes.patch("/:id",catchAsync())
user_routes.delete("/:id",catchAsync())