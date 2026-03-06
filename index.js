import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/database_connection.js";
import { errorHandler } from "./src/midleware/errorHandler.middleware.js";
import { user_routes } from "./src/modules/user/user.controller.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/user", user_routes);



app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}!`));

