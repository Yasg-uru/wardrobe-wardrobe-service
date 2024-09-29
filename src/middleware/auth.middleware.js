"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const errorhandler_util_1 = __importDefault(require("../util/errorhandler.util"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    if (!token) {
        return next(new errorhandler_util_1.default(400, "please Login to continue"));
    }
    //   console.log("this is a token :", token);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
        return next(new errorhandler_util_1.default(400, "please login to continue"));
    }
    req.user = decoded;
    next();
};
exports.isAuthenticated = isAuthenticated;
