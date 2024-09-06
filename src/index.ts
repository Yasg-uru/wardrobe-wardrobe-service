import express, { Application } from "express";
import { config } from "dotenv";
import connectDb from "./util/connectDb";
import { ErrorhandlerMiddleware } from "./middleware/error.middleware";
import clothRouter from "./router/cloth.router";
import cors from "cors";

import cookieParser from "cookie-parser";

config();

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://virtual-wardrobe-frontend.vercel.app","http://localhost:5173"],
  
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const PORT = process.env.PORT || 4001;
app.use("/cloth", clothRouter);

connectDb();
app.use(ErrorhandlerMiddleware);

app.listen(PORT, () => {
  console.log(`wardrobe service is running on port : ${PORT}`);
});
