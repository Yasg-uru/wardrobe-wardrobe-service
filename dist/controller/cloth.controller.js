"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorhandler_util_1 = __importDefault(require("../util/errorhandler.util"));
const wardrobe_model_1 = __importDefault(require("../model/wardrobe.model"));
const cloudinary_util_1 = __importDefault(require("../util/cloudinary.util"));
const Weather_service_1 = __importDefault(require("../service/Weather.service"));
class ClothController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!req.file) {
                    return next(new errorhandler_util_1.default(404, "please select file first"));
                }
                const { category, color, size, brand, material, tags, purchaseDate, condition, seasonSuitability, weatherSuitability, wearcount, lastWorn, cost, isFavorite, isArchived, } = req.body;
                const cloudinary = yield (0, cloudinary_util_1.default)(req.file.path);
                const imageurl = cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.secure_url;
                console.log("this is a req.body data :", req.body);
                const newClothItem = new wardrobe_model_1.default({
                    category,
                    color,
                    size,
                    brand,
                    material,
                    tags: tags.split(","),
                    purchaseDate,
                    condition,
                    wearcount,
                    lastWorn,
                    cost,
                    seasonSuitability: JSON.parse(seasonSuitability),
                    weatherSuitability: JSON.parse(weatherSuitability),
                    isFavorite: isFavorite === "true",
                    isArchived: isArchived === "true",
                    imageurl,
                    userId,
                });
                yield newClothItem.save();
                res.status(201).json({
                    success: true,
                    message: "Successfully createed your cloth item ",
                    newClothItem,
                });
            }
            catch (error) {
                console.log("this is a error :", error);
                next(error);
            }
        });
    }
    static delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clothId } = req.params;
                const deletedcloth = yield wardrobe_model_1.default.findById(clothId);
                if (!deletedcloth) {
                    return next(new errorhandler_util_1.default(404, "cloth not found"));
                }
                res.status(200).json({
                    success: true,
                    message: "Successfully deleted your cloth",
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ClothId } = req.params;
            //implemented soon after creating all the controllers
        });
    }
    // public static async Recommandationwheather(
    //   req: RequestWithUser,
    //   res: Response,
    //   next: NextFunction
    // ) {
    //   const userId = req.user?.id;
    //   const lat: number = 22.07;
    //   const lon: number = 78.93;
    //   try {
    //     const weather = await WeatherService.fetchdata(lat, lon, next);
    //     const { temp_c, condition, wind_kph } = weather.current;
    //     console.log("this is a weather:", weather);
    //     const isRainy = condition.text.toLowerCase().includes("rain");
    //     const isWindy = wind_kph > 15;
    //     const isSunny = condition.text.toLowerCase().includes("sunny");
    //     const isCloudy = condition.text.toLowerCase().includes("cloudy");
    //     const isSnowy = condition.text.toLowerCase().includes("snow");
    //     // Adjust season suitability
    //     const isSummer = temp_c > 30;
    //     const isWinter = temp_c < 18;
    //     const isSpring = temp_c >= 18 && temp_c <= 25;
    //     const isAutumn = temp_c > 25 && temp_c <= 30;
    //     // Fetch suitable clothes based on weather and season
    //     let sustainableCloths = await ClothModel.find({
    //       userId,
    //       "weatherSuitability.isRainSuitable": isRainy,
    //       "weatherSuitability.isWindSuitable": isWindy,
    //       "weatherSuitability.isSunnySuitable": isSunny,
    //       "weatherSuitability.isCloudySuitable": isCloudy,
    //       "weatherSuitability.isSnowySuitable": isSnowy,
    //     });
    //     if (sustainableCloths.length === 0) {
    //       sustainableCloths = await ClothModel.find({
    //         userId,
    //         "seasonSuitability.isSummer": isSummer,
    //         "seasonSuitability.isWinter": isWinter,
    //         "seasonSuitability.isSpring": isSpring,
    //         "seasonSuitability.isAutumn": isAutumn,
    //       });
    //     }
    //     res.status(200).json({
    //       success: true,
    //       message: "Successfully fetched your recommended clothes",
    //       sustainableCloths,
    //     });
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    static Recommandationwheather(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("this is a recommandation api request:", req.query);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { lat, lon } = req.query;
            if (!lat || !lon) {
                return next(new errorhandler_util_1.default(400, "please provide lat lon"));
            }
            try {
                const weather = yield Weather_service_1.default.fetchdata(lat.toString(), lon.toString(), next);
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
                let sustainableCloths = [];
                // Check for rain suitability
                if (isRainy) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "weatherSuitability.isRainSuitable": true,
                    });
                }
                // Check for wind suitability
                if (sustainableCloths.length === 0 && isWindy) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "weatherSuitability.isWindSuitable": true,
                    });
                }
                // Check for sunny suitability
                if (sustainableCloths.length === 0 && isSunny) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "weatherSuitability.isSunnySuitable": true,
                    });
                }
                // Check for cloudy suitability
                if (sustainableCloths.length === 0 && isCloudy) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "weatherSuitability.isCloudySuitable": true,
                    });
                }
                // Check for snow suitability
                if (sustainableCloths.length === 0 && isSnowy) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "weatherSuitability.isSnowySuitable": true,
                    });
                }
                // Check for summer suitability
                if (sustainableCloths.length === 0 && isSummer) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "seasonSuitability.isSummer": true,
                    });
                }
                // Check for winter suitability
                if (sustainableCloths.length === 0 && isWinter) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "seasonSuitability.isWinter": true,
                    });
                }
                // Check for spring suitability
                if (sustainableCloths.length === 0 && isSpring) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "seasonSuitability.isSpring": true,
                    });
                }
                // Check for autumn suitability
                if (sustainableCloths.length === 0 && isAutumn) {
                    sustainableCloths = yield wardrobe_model_1.default.find({
                        userId,
                        "seasonSuitability.isAutumn": true,
                    });
                }
                res.status(200).json({
                    success: true,
                    message: sustainableCloths.length > 0
                        ? "Successfully fetched your recommended clothes"
                        : "No suitable clothes found for the current weather or season",
                    sustainableCloths,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static SearchCloths(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { searchQuery } = req.query;
                if (typeof searchQuery !== "string" || !searchQuery.trim()) {
                    return next(new errorhandler_util_1.default(400, "Invalid search query"));
                }
                console.log("this is a query:", searchQuery);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const result = yield wardrobe_model_1.default.find({
                    userId,
                    $text: { $search: searchQuery.trim() },
                });
                // if (result.length === 0) {
                //   return next(new Errorhandler(404, "No result found"));
                // }
                console.log("this is a result:", result);
                res.status(200).json({
                    message: "searched your results successfully",
                    result,
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static filter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { category, color, size, brand, material, tags, condition, isRainSuitable, isWindSuitable, isSunnySuitable, isCloudySuitable, isSnowySuitable, isSummer, isWinter, isSpring, isAutumn, isFavorite, isArchived, minCost, maxCost, minWearCount, maxWearCount, } = req.query;
                console.log("this is a request query:", req.query);
                const query = {};
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
                if (isRainSuitable === "true" || isRainSuitable === "false") {
                    query["weatherSuitability.isRainSuitable"] = isRainSuitable === "true";
                }
                if (isWindSuitable === "true" || isWindSuitable === "false") {
                    query["weatherSuitability.isWindSuitable"] = isWindSuitable === "true";
                }
                if (isCloudySuitable === "true" || isCloudySuitable === "false") {
                    query["weatherSuitability.isCloudySuitable"] =
                        isCloudySuitable === "true";
                }
                if (isSunnySuitable === "true" || isSunnySuitable === "false") {
                    query["weatherSuitability.isSunnySuitable"] =
                        isSunnySuitable === "true";
                }
                if (isSnowySuitable === "true" || isSnowySuitable === "false") {
                    query["weatherSuitability.isSnowySuitable"] =
                        isSnowySuitable === "true";
                }
                if (isSummer === "true" || isSummer === "false") {
                    query["seasonSuitability.isSummer"] = isSummer === "true";
                }
                if (isWinter === "true" || isWinter === "false") {
                    query["seasonSuitability.isWinter"] = isWinter === "true";
                }
                if (isSpring === "true" || isSpring === "false") {
                    query["seasonSuitability.isSpring"] = isSpring === "true";
                }
                if (isAutumn === "true" || isAutumn === "false") {
                    query["seasonSuitability.isAutumn"] = isAutumn === "true";
                }
                if (isArchived === "true" || isArchived === "false") {
                    query.isArchived = isArchived === "true";
                }
                if (isFavorite === "true" || isFavorite === "false") {
                    query.isFavorite = isFavorite === "true";
                }
                if (minCost || maxCost) {
                    query.cost = {};
                }
                if (minCost) {
                    query.cost.$gte = Number(minCost);
                }
                if (maxCost) {
                    query.cost.$lte = Number(maxCost);
                }
                if (minWearCount || maxWearCount) {
                    query.wearcount = {};
                }
                if (minWearCount) {
                    query.wearcount.$gte = Number(minWearCount);
                }
                if (maxWearCount) {
                    query.wearcount.$lte = Number(maxWearCount);
                }
                console.log("this is a query:", query);
                const results = yield wardrobe_model_1.default.find(query);
                res.status(200).json({
                    message: "successfully fetched filtered data ",
                    results,
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static Wear(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clothId } = req.params;
                const cloth = yield wardrobe_model_1.default.findById(clothId);
                if (!cloth) {
                    return next(new errorhandler_util_1.default(404, "Cloth not found"));
                }
                const { condition } = req.body;
                cloth.wearcount += 1;
                cloth.lastWorn = new Date();
                if (cloth.condition === "New") {
                    cloth.condition = "Worn";
                }
                else if (condition) {
                    cloth.condition = condition;
                }
                yield cloth.save();
                res.status(200).json({
                    message: "Successfully updated cloth status",
                    cloth,
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static GetWearAnalysis(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const cloths = yield wardrobe_model_1.default.find({ userId }).sort({ wearcount: 1 });
            if (cloths.length === 0) {
                return next(new errorhandler_util_1.default(404, "Sorry, No cloth found "));
            }
            const leastWorn = cloths.slice(0, 2);
            const mostWorn = cloths.slice(-2).reverse();
            const TotalWearCount = cloths.reduce((acc, cloth) => acc + cloth.wearcount, 0);
            const AverageWearCount = TotalWearCount / cloths.length;
            const underUtilizedCloths = cloths.filter((cloth) => cloth.wearcount < AverageWearCount);
            res.status(200).json({
                message: "successfully fetched wear analysis",
                wornData: { leastWorn, mostWorn, underUtilizedCloths },
                AverageWearCount,
            });
        });
    }
    static getReminder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const rainyClothsCount = yield wardrobe_model_1.default.countDocuments({
                    userId: user.id,
                    "weatherSuitability.isRainSuitable": isRainy,
                });
                if (rainyClothsCount < minimumStockThreshold && isRainy) {
                    return res.status(200).json({
                        title: "Low Rainy Weather Clothes Stock",
                        reminder: `You have only ${rainyClothsCount} rainy weather suitable clothes. Consider adding more.`,
                    });
                }
                const summerClothsCount = yield wardrobe_model_1.default.countDocuments({
                    userId: user.id,
                    "seasonSuitability.isSummer": isSummer,
                });
                if (summerClothsCount < minimumStockThreshold && isSummer) {
                    return res.status(200).json({
                        title: "Low Summer Clothes Stock",
                        reminder: `You have only ${summerClothsCount} summer clothes. Consider adding more.`,
                    });
                }
                const winterClothsCount = yield wardrobe_model_1.default.countDocuments({
                    userId: user.id,
                    "weatherSuitability.isWinterSuitable": isWinter,
                });
                if (winterClothsCount < minimumStockThreshold && isWinter) {
                    return res.status(200).json({
                        title: "Low Winter Clothes Stock",
                        reminder: `You have only ${winterClothsCount} winter clothes. Consider adding more.`,
                    });
                }
                return res.status(200).json({
                    title: "Seasonal Clothing Update",
                    reminder: "You’re all set! You have enough clothing for the current season.",
                });
            }
            catch (error) {
                console.error("Error in getReminder:", error);
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static GetClothInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clothId } = req.params;
                const cloth = yield wardrobe_model_1.default.findById(clothId);
                if (!cloth) {
                    return next(new errorhandler_util_1.default(404, "No results found "));
                }
                res.status(200).json({
                    success: true,
                    message: "Successfully fetched your cloth details",
                    cloth,
                });
            }
            catch (error) {
                next();
            }
        });
    }
    static GetCollections(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const Collections = yield wardrobe_model_1.default.find({ userId });
                if (Collections.length === 0) {
                    return next(new errorhandler_util_1.default(404, "Collections not found "));
                }
                res.status(200).json({
                    success: true,
                    message: "Successfully fetched your collections ",
                    Collections,
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static GetArchiveCloths(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const Cloths = yield wardrobe_model_1.default.find({ userId, isArchived: true });
                if (Cloths.length === 0) {
                    return next(new errorhandler_util_1.default(404, "No cloths found"));
                }
                res.status(200).json({
                    Cloths,
                });
            }
            catch (error) {
                next();
            }
        });
    }
    //remove from archive
    static RemoveFromArchive(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { clothId } = req.params;
                const cloth = yield wardrobe_model_1.default.findById(clothId);
                if (!cloth) {
                    return next(new errorhandler_util_1.default(404, "cloth not found"));
                }
                cloth.isArchived = false;
                yield cloth.save();
                res.status(200).json({
                    message: "Successfully Removed from Archive",
                });
            }
            catch (error) {
                next();
            }
        });
    }
}
exports.default = ClothController;
