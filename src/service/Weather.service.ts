import { NextFunction } from "express";
import Errorhandler from "../util/errorhandler.util";
import axios from "axios";
class WeatherService {
  private static readonly BASE_URL =
    "https://api.weatherapi.com/v1/forecast.json";
  private static readonly API_KEY = "995967ca3cd04f8f92a32058240204";
  public static async fetchdata(lat: string, lon: string, next: NextFunction) {
    try {
      
      const response = await axios.get(this.BASE_URL, {
        params: {
          key: this.API_KEY,
          q: `${parseInt(lat)},${parseInt(lon)}`,
        },
      });
      return response.data;
    } catch (error) {
      next(new Errorhandler(500, "No matching location found"));
    }
  }
}
export default WeatherService;
