import express from "express";
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { saveToken, getToken } from "./FirebaseServices.js";

import {Expo} from "expo-server-sdk";

const app = express();
const expo = new Expo();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());



app.use("/api/v1", router);

app.use(errorHandler);

export default app;
