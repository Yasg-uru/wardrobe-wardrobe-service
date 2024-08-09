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
  public static async SearchCloths(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { searchQuery } = req.query;
      if (typeof searchQuery !== "string" || !searchQuery.trim()) {
        return res.status(400).json({ message: "Invalid search query" });
      }
      const userId = req.user?.id;

      const result = await ClothModel.find({
        userId,
        $text: { $search: searchQuery.trim() },
      });
      if (result.length === 0) {
        return next(new Errorhandler(404, "No result found"));
      }
      res.status(200).json({
        message: "searched your results successfully",
        result,
      });
    } catch (error) {
      next(new Errorhandler(500, "Internal server error"));
    }
  }
  public static async filter(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const {
        category,
        color,
        size,
        brand,
        material,
        tags,
        condition,
        isRainSuitable,
        isWindSuitable,
        isSunnySuitable,
        isCloudySuitable,
        isSnowySuitable,
        isSummer,
        isWinter,
        isSpring,
        isAutumn,
        isFavorite,
        isArchived,
        minCost,
        maxCost,
        minWearCount,
        maxWearCount,
      } = req.query;
      const query: any = {};
      query.userId = userId;
      if (category) {
        query.category = category;
      }
      if (color) {
        query.color = color;
      }
      if (size) {
        query.size = size;
      }
      if (brand) {
        query.brand = brand;
      }
      if (material) {
        query.material = material;
      }
      if (condition) {
        query.condition = condition;
      }
      if (typeof isRainSuitable === "boolean") {
        query["weatherSuitability.isRainSuitable"] = isRainSuitable;
      }
      if (typeof isWindSuitable === "boolean") {
        query["weatherSuitability.isWindSuitable"] = isWindSuitable;
      }
      if (typeof isCloudySuitable === "boolean") {
        query["weatherSuitability.isCloudySuitable"] = isCloudySuitable;
      }
      if (typeof isSunnySuitable === "boolean") {
        query["weatherSuitability.isSunnySuitable"] = isSunnySuitable;
      }
      if (typeof isSnowySuitable === "boolean") {
        query["weatherSuitability.isSnowySuitable"] = isSnowySuitable;
      }
      if (typeof isSummer === "boolean") {
        query["seasonSuitability.isSummer"] = isSummer;
      }
      if (typeof isWinter === "boolean") {
        query["seasonSuitability.isWinter"] = isWinter;
      }
      if (typeof isSpring === "boolean") {
        query["seasonSuitability.isSpring"] = isSpring;
      }
      if (typeof isAutumn === "boolean") {
        query["seasonSuitability.isAutumn"] = isAutumn;
      }
      if (typeof isArchived === "boolean") {
        query.isArchived = isArchived;
      }
      if (typeof isFavorite === "boolean") {
        query.isFavorite = isFavorite;
      }
      if (typeof isAutumn === "boolean") {
        query["seasonSuitability.isAutumn"] = isAutumn;
      }
      if (minCost || maxCost) {
        query.cost = {};
      }
      if (minCost) {
        query.cost.$gte = minCost;
      }
      if (maxCost) {
        query.cost.$lte = maxCost;
      }
      if (minWearCount || maxWearCount) {
        query.wearcount = {};
      }
      if (minWearCount) {
        query.wearcount.$gte = minWearCount;
      }
      if (maxWearCount) {
        query.wearcount.$lte = maxWearCount;
      }
      const results = await ClothModel.find(query);
      if (results.length === 0) {
        return next(new Errorhandler(404, "Sorry no result found "));
      }
      res.status(200).json({
        message: "successfully fetched filtered data ",
        results,
      });
    } catch (error) {
      next(new Errorhandler(500, "Internal server error"));
    }
  }
  public static async Wear(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { clothId } = req.params;
      const cloth = await ClothModel.findById(clothId);
      if (!cloth) {
        return next(new Errorhandler(404, "Cloth not found"));
      }
      const { condition } = req.body;
      cloth.wearcount += 1;
      cloth.lastWorn = new Date();
      if (cloth.condition === "New") {
        cloth.condition = "Worn";
      } else if (condition) {
        cloth.condition = condition;
      }
      await cloth.save();
      res.status(200).json({
        message: "Successfully updated cloth status",
        cloth,
      });
    } catch (error) {
      next(new Errorhandler(500, "Internal server error"));
    }
  }
  public static async GetWearAnalysis(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user?.id;
    const cloths = await ClothModel.find({ userId }).sort({ wearcount: 1 });
    const leastWorn = cloths.slice(0, 2);
    const mostWorn = cloths.slice(-2).reverse();
    const TotalWearCount = cloths.reduce(
      (acc, cloth) => acc + cloth.wearcount,
      0
    );
    const AverageWearCount = TotalWearCount / cloths.length;
    const underUtilizedCloths = cloths.filter(
      (cloth) => cloth.wearcount < AverageWearCount
    );
    res.status(200).json({
      message: "successfully fetched wear analysis",
      leastWorn,
      mostWorn,
      underUtilizedCloths,
      AverageWearCount,
    });
  }
  public static async getReminder(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const currentmonth = new Date().getMonth() + 1;
      const isRainy = [7, 8, 9].includes(currentmonth);
      const isWinter = [10, 11, 12, 1, 2].includes(currentmonth);
      const isSummer = [3, 4, 5, 6].includes(currentmonth);
      console.log(isRainy, isWinter, isSummer);
      const minimumStockThreshold = 3;

      const rainyClothsCount = await ClothModel.countDocuments({
        userId: user.id,
        "weatherSuitability.isRainSuitable": isRainy,
      });

      if (rainyClothsCount < minimumStockThreshold) {
        // sendReminder(
        //   user.email,
        //   "Low Rainy Weather Clothes Stock",
        //   `You have only ${rainyClothsCount} rainy weather suitable clothes. Consider adding more.`
        // );
        return res.status(200).json({
          title: "Low Rainy Weather Clothes Stock",
          reminder: `You have only ${rainyClothsCount} rainy weather suitable clothes. Consider adding more.`,
        });
      }

      const summerClothsCount = await ClothModel.countDocuments({
        userId: user.id,
        "seasonSuitability.isSummer": isSummer,
      });

      if (summerClothsCount < minimumStockThreshold) {
        // sendReminder(
        //   user.email,
        //   "Low Summer Clothes Stock",
        //   `You have only ${summerClothsCount} summer clothes. Consider adding more.`
        // );
        return res.status(200).json({
          title: "Low Summer Clothes Stock",
          reminder: `You have only ${summerClothsCount} summer clothes. Consider adding more.`,
        });
      }

      const winterClothsCount = await ClothModel.countDocuments({
        userId: user.id,
        "weatherSuitability.isWinterSuitable": isWinter,
      });

      if (winterClothsCount < minimumStockThreshold) {
        // sendReminder(
        //   user.email,
        //   "Low Winter Clothes Stock",
        //   `You have only ${winterClothsCount} winter clothes. Consider adding more.`
        // );
        return res.status(200).json({
          title: "Low Winter Clothes Stock",
          reminder: `You have only ${winterClothsCount} winter clothes. Consider adding more.`,
        });
      }

      return res.status(200).json({ message: "Reminder check completed" });
    } catch (error) {
      console.error("Error in getReminder:", error);
      next(new Errorhandler(500, "Internal server error"));
    }
  }
}
export default ClothController;
