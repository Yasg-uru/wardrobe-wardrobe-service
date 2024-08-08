import {Router} from "express";
import upload from "../middleware/multer.middleware";
import ClothController from "../controller/cloth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
const clothRouter=Router();
clothRouter.post('/create',upload.single("imageurl"),isAuthenticated,ClothController.create)
export default clothRouter;
