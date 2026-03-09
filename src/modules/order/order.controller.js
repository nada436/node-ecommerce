import  { Router } from "express";
import { createOrder, getMyOrders } from "./order.service.js";
import { optionalAuth } from "../../midleware/OptionalAuthMiddleware.js";
import { validate } from "../../midleware/validate.middleware.js";
import { createOrderSchema } from "./order.validation.js";

import { catchAsync } from './../../midleware/errorHandler.middleware.js';
import { auth } from "../../midleware/auth.middleware.js";


export const order_routes = Router();

order_routes.post("/",validate(createOrderSchema) ,optionalAuth,catchAsync(createOrder));
order_routes.get("/",auth,optionalAuth,catchAsync(getMyOrders));




export default order_routes;