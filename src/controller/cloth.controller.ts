import { Request, NextFunction, Response } from "express";
import Errorhandler from "../util/errorhandler.util";
import ClothModel from "../model/wardrobe.model";
import UploadOnCloudinary from "../util/cloudinary.util";
import { RequestWithUser } from "../types/ReqwithUser";

class ClothController {
  public static async create(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!req.file) {
        return next(new Errorhandler(404, "please select file first"));
      }

      const {
        category,
        color,
        size,
        brand,
        material,
        tags,
        purchaseDate,
        condition,
        wearcount,
        lastWorn,
        cost,
        isFavorite,
        isArchived,
      } = req.body;
      const cloudinary = await UploadOnCloudinary(req.file.path);
      const imageurl = cloudinary?.secure_url;

      const newClothItem = new ClothModel({
        category,
        color,
        size,
        brand,
        material,
        tags,
        purchaseDate,
        condition,
        wearcount,
        lastWorn,
        cost,
        isFavorite,
        isArchived,
        imageurl,
        userId,
      });
      await newClothItem.save();
      
      res.status(201).json({
        success: true,
        message: "Successfully createed your cloth item ",
        newClothItem,
      });
    } catch (error) {
      console.log("this is a error :", error);
      next(new Errorhandler(500, "Internal server error"));
    }
  }
}
export default ClothController;
