import express, { Application } from "express";
import { config } from "dotenv";
import connectDb from "./util/connectDb";
config();

const app: Application = express();
const PORT = process.env.PORT || 4001;
connectDb();
app.listen(PORT, () => {
  console.log(`wardrobe service is running on port : ${PORT}`);
});
