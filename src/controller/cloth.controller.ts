import { Request, NextFunction, Response } from "express";
import Errorhandler from "../util/errorhandler.util";
import ClothModel from "../model/wardrobe.model";
import UploadOnCloudinary from "../util/cloudinary.util";
import { RequestWithUser } from "../types/ReqwithUser";
import WeatherService from "../service/Weather.service";
class ClothController {
  public static async create(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    // try {
    const userId = req.user?.id;
    //   if (!req.file) {
    //     return next(new Errorhandler(404, "please select file first"));
    //   }

    const {
      category,
      color,
      size,
      brand,
      material,
      tags,
      purchaseDate,
      condition,
      seasonSuitability,
      weatherSuitability,
      wearcount,
      lastWorn,
      cost,
      isFavorite,
      isArchived,
    } = req.body;
    //   const cloudinary = await UploadOnCloudinary(req.file.path);
    //   const imageurl = cloudinary?.secure_url;

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
      seasonSuitability,
      weatherSuitability,
      isFavorite,
      isArchived,
      imageurl: null,
      userId,
    });
    await newClothItem.save();

    res.status(201).json({
      success: true,
      message: "Successfully createed your cloth item ",
      newClothItem,
    });
    // } catch (error) {
    //   console.log("this is a error :", error);
    //   next(new Errorhandler(500, "Internal server error"));
    // }
  }
  public static async delete(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { clothId } = req.params;
      const deletedcloth = await ClothModel.findById(clothId);
      if (!deletedcloth) {
        return next(new Errorhandler(404, "cloth not found"));
      }
      res.status(200).json({
        success: true,
        message: "Successfully deleted your cloth",
      });
    } catch (error) {
      next(new Errorhandler(500, "Internal server error"));
    }
  }
  public static async update(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const { ClothId } = req.params;
    //implemented soon after creating all the controllers
  }
  // public static async Recommandationwheather(
  //   req: RequestWithUser,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const userId = req.user?.id;
  //   const lat: number = 22.07;
  //   const lon: number = 78.93;
  //   const weather = await WeatherService.fetchdata(lat, lon, next);
  //   const { temp_c, condition, wind_kph } = weather.current;
  //   console.log("this is a weather:",weather)
  //   const isRainy = condition.text.toLowerCase().includes("rain");
  //   const isWindy = wind_kph > 15;
  //   const isSunny = condition.text.toLowerCase().includes("sunny");
  //   const isCloudy = condition.text.toLowerCase().includes("cloudy");
  //   const isSnowy = condition.text.toLowerCase().includes("snow");

  //   // Adjust season suitability
  //   const isSummer = temp_c > 30;
  //   const isWinter = temp_c < 18;
  //   const isSpring = temp_c >= 18 && temp_c <= 25;
  //   const isAutumn = temp_c > 25 && temp_c <= 30;

  //   // Fetch suitable clothes based on weather and season
  //   let sustainableCloths = await ClothModel.find({
  //     userId,
  //     "weatherSuitability.isRainSuitable": isRainy,
  //     "weatherSuitability.isWindSuitable": isWindy,
  //     "weatherSuitability.isSunnySuitable": isSunny,
  //     "weatherSuitability.isCloudySuitable": isCloudy,
  //     "weatherSuitability.isSnowySuitable": isSnowy,
  //     // $or: [
  //     //   { "seasonSuitability.isSummer": isSummer },
  //     //   { "seasonSuitability.isWinter": isWinter },
  //     //   { "seasonSuitability.isSpring": isSpring },
  //     //   { "seasonSuitability.isAutumn": isAutumn },
  //     // ],
  //   });

  //   res.status(200).json({
  //     success: true,
  //     message: "successfully fetched your recommanded cloths",
  //     sustainableCloths,
  //   });
  // }
  public static async Recommandationwheather(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user?.id;
    const lat: number = 22.07;
    const lon: number = 78.93;

    try {
      const weather = await WeatherService.fetchdata(lat, lon, next);
      const { temp_c, condition, wind_kph } = weather.current;
      console.log("this is a weather:", weather);

      const isRainy = condition.text.toLowerCase().includes("rain");
      const isWindy = wind_kph > 15;
      const isSunny = condition.text.toLowerCase().includes("sunny");
      const isCloudy = condition.text.toLowerCase().includes("cloudy");
      const isSnowy = condition.text.toLowerCase().includes("snow");

      // Adjust season suitability
      const isSummer = temp_c > 30;
      const isWinter = temp_c < 18;
      const isSpring = temp_c >= 18 && temp_c <= 25;
      const isAutumn = temp_c > 25 && temp_c <= 30;

      // Fetch suitable clothes based on weather and season
      let sustainableCloths = await ClothModel.find({
        userId,

        "weatherSuitability.isRainSuitable": isRainy,
        "weatherSuitability.isWindSuitable": isWindy,
        "weatherSuitability.isSunnySuitable": isSunny,
        "weatherSuitability.isCloudySuitable": isCloudy,
        "weatherSuitability.isSnowySuitable": isSnowy,
      });
      if (sustainableCloths.length === 0) {
        sustainableCloths = await ClothModel.find({
          userId,
          "seasonSuitability.isSummer": isSummer,
          "seasonSuitability.isWinter": isWinter,
          "seasonSuitability.isSpring": isSpring,
          "seasonSuitability.isAutumn": isAutumn,
        });
      }
      res.status(200).json({
        success: true,
        message: "Successfully fetched your recommended clothes",
        sustainableCloths,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default ClothController;
