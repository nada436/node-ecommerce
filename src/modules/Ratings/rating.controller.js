import { Router } from "express";

import { auth } from "../../midleware/auth.middleware.js";
import {
  createRating,
  deleteRating,
  getAllProductRatings,
  updateRating,
} from "./rating.service.js";

export const rating_routes = Router();

rating_routes.post("/:productId/ratings", auth, createRating);
rating_routes.get("/:productId/ratings", getAllProductRatings);
rating_routes.patch("/ratings/:ratingId", updateRating);
rating_routes.delete("/ratings/:ratingId", deleteRating);
