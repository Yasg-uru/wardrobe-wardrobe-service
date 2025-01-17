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
exports.sendToken = exports.GenerateToken = exports.Comparepassword = exports.HashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
exports.HashPassword = HashPassword;
const Comparepassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashedPassword);
});
exports.Comparepassword = Comparepassword;
const GenerateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, _id, isVerified } = user;
    return jsonwebtoken_1.default.sign({ username, email, id: _id, isVerified }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
});
exports.GenerateToken = GenerateToken;
const sendToken = (res, token, statuscode, user) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        expires: new Date(Date.now() +
            parseInt(process.env.COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000),
        httpOnly: true, // Ensures the cookie is accessible only via HTTP(S) and not JavaScript
        sameSite: "none", // Ensures the cookie is sent in cross-origin requests
        secure: true, // Ensures the cookie is sent only over HTTPS in production
    };
    user.lastLogin = new Date();
    yield user.save();
    res.cookie("token", token, options).status(statuscode).json({
        success: true,
        message: "Logged in successfully",
        token,
        user,
    });
});
exports.sendToken = sendToken;
