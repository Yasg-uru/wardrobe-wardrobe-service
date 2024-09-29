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
const axios_1 = __importDefault(require("axios"));
class WeatherService {
    static fetchdata(lat, lon, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(this.BASE_URL, {
                    params: {
                        key: this.API_KEY,
                        q: `${parseInt(lat)},${parseInt(lon)}`,
                    },
                });
                return response.data;
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "No matching location found"));
            }
        });
    }
}
WeatherService.BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
WeatherService.API_KEY = "995967ca3cd04f8f92a32058240204";
exports.default = WeatherService;
