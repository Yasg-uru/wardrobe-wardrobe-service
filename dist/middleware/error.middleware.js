"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorhandlerMiddleware = void 0;
const errorhandler_util_1 = __importDefault(require("../util/errorhandler.util"));
const ErrorhandlerMiddleware = (err, req, res, next) => {
    if (err instanceof errorhandler_util_1.default) {
        return res.status(err.statuscode).json({
            message: err.message,
        });
    }
    return res.status(500).json({
        message: "Internal Server Error",
    });
};
exports.ErrorhandlerMiddleware = ErrorhandlerMiddleware;
