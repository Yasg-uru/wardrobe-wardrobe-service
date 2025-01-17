"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const user_model_1 = __importDefault(require("../model/user.model"));
const crypto_1 = __importDefault(require("crypto"));
const auth_util_1 = require("../util/auth.util");
const sendmail_1 = __importStar(require("../util/sendmail"));
const cloudinary_util_1 = __importDefault(require("../util/cloudinary.util"));
const errorhandler_util_1 = __importDefault(require("../util/errorhandler.util"));
// import sendVerificationMail from "src/util/sendmail";
// import {sendResetPasswordMail } from "../util/sendmail"
class UserController {
    static Register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                const ExisitingUser = yield user_model_1.default.findOne({
                    email,
                    isVerified: true,
                });
                if (ExisitingUser) {
                    return next(new errorhandler_util_1.default(400, "User Already verified"));
                }
                const ExisitingUserUnverified = yield user_model_1.default.findOne({
                    email,
                    isVerified: false,
                });
                let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
                if (ExisitingUserUnverified) {
                    ExisitingUserUnverified.passwordHash = yield (0, auth_util_1.HashPassword)(password);
                    ExisitingUserUnverified.verifycode = verifyCode;
                    ExisitingUserUnverified.VerifyCodeExpiry = new Date(Date.now() + 3600000);
                    yield ExisitingUserUnverified.save();
                    const EmailResponse = yield (0, sendmail_1.default)(username, email, verifyCode);
                    if (!EmailResponse.success) {
                        return next(new errorhandler_util_1.default(400, EmailResponse.message));
                    }
                }
                else {
                    const passwordHash = yield (0, auth_util_1.HashPassword)(password);
                    if (req.file && req.file.path) {
                        const cloudinaryUrl = yield (0, cloudinary_util_1.default)(req.file.path);
                        const profileUrl = cloudinaryUrl === null || cloudinaryUrl === void 0 ? void 0 : cloudinaryUrl.secure_url;
                        const newUser = new user_model_1.default({
                            username,
                            email,
                            passwordHash,
                            isVerified: false,
                            verifycode: verifyCode,
                            profileUrl: profileUrl,
                            VerifyCodeExpiry: new Date(Date.now() + 3600000),
                        });
                        yield newUser.save();
                    }
                    else {
                        const newUser = new user_model_1.default({
                            username,
                            email,
                            passwordHash,
                            isVerified: false,
                            verifycode: verifyCode,
                            profileUrl: null,
                            VerifyCodeExpiry: new Date(Date.now() + 3600000),
                        });
                        yield newUser.save();
                    }
                    const EmailResponse = yield (0, sendmail_1.default)(username, email, verifyCode);
                    if (!EmailResponse.success) {
                        return next(new errorhandler_util_1.default(400, EmailResponse.message));
                    }
                }
                res.status(201).json({
                    success: true,
                    message: "Registered user successfully , Please verify your account first",
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server Error"));
            }
        });
    }
    static verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, code } = req.body;
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    return next(new errorhandler_util_1.default(404, "user not found"));
                }
                const isValidCode = user.verifycode === code;
                const isNotCodeVerify = new Date(user.VerifyCodeExpiry) > new Date();
                if (isNotCodeVerify && isValidCode) {
                    user.isVerified = true;
                    yield user.save();
                    res.status(200).json({
                        success: true,
                        message: "your account has been verified successfully , please Login to continue",
                    });
                }
                else if (!isNotCodeVerify) {
                    return next(new errorhandler_util_1.default(404, "Expired verification code . please signup again to get a new code"));
                }
                else {
                    return next(new errorhandler_util_1.default(404, "Incorrect verification code . please signup again to get a new code"));
                }
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static checkAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    return next(new errorhandler_util_1.default(404, "user not found please login to continue"));
                }
                res.status(200).json({
                    user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static Login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    return next(new errorhandler_util_1.default(404, "User not found"));
                }
                if (user.isVerified === false) {
                    return next(new errorhandler_util_1.default(400, "you are unable to Login please verify user account first"));
                }
                const isCorrectPassword = yield (0, auth_util_1.Comparepassword)(password, user.passwordHash);
                if (!isCorrectPassword) {
                    return next(new errorhandler_util_1.default(400, "Incorrect Credentials"));
                }
                const token = yield (0, auth_util_1.GenerateToken)(user);
                yield (0, auth_util_1.sendToken)(res, token, 200, user);
            }
            catch (error) {
                console.log("this is error in login :", error);
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static getAlluser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.find({});
                res.status(200).json({
                    users,
                });
            }
            catch (error) {
                next(new errorhandler_util_1.default(500, "Internal server error"));
            }
        });
    }
    static Logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.cookie("token", null, { expires: new Date() }).status(200).json({
                message: "Logged out Successfully",
            });
        });
    }
    static ForgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const ExisitingUser = yield user_model_1.default.findOne({ email });
                if (!ExisitingUser) {
                    return next(new errorhandler_util_1.default(404, "User not found "));
                }
                //after this we need to create the logic of sending mail to that particular mail address
                // we need to generate the reset password token
                ExisitingUser.ForgotPasswordResetToken = crypto_1.default
                    .randomBytes(20)
                    .toString("hex");
                ExisitingUser.ForgotPasswordResetTokenExpiry = new Date(Date.now() + 3600000);
                yield ExisitingUser.save();
                const MailResponse = yield (0, sendmail_1.sendResetPasswordMail)(ExisitingUser.ForgotPasswordResetToken, ExisitingUser.email);
                if (!MailResponse.success) {
                    return next(new errorhandler_util_1.default(400, MailResponse.message));
                }
                res.status(200).json({
                    success: true,
                    message: "Sent mail successfully",
                });
            }
            catch (error) {
                next();
            }
        });
    }
    static ResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { password } = req.body;
                const FindUserByToken = yield user_model_1.default.findOne({
                    ForgotPasswordResetToken: token,
                });
                if (!FindUserByToken) {
                    return next(new errorhandler_util_1.default(404, "User not found with this token "));
                }
                FindUserByToken.passwordHash = yield (0, auth_util_1.HashPassword)(password);
                FindUserByToken.ForgotPasswordResetToken = undefined;
                FindUserByToken.ForgotPasswordResetTokenExpiry = undefined;
                yield FindUserByToken.save();
                res.status(200).json({
                    message: "reset password successfully please login  to continue",
                });
            }
            catch (error) {
                next();
            }
        });
    }
    static editProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return next(new errorhandler_util_1.default(401, "Unauthorized: Please log in"));
                }
                let updateData = Object.assign({}, req.body); // Clone req.body to modify it
                // Handle profile image upload if provided
                if (req.file) {
                    const file = req.file.path; // File path from multer
                    // Upload image to Cloudinary
                    const uploadResult = yield (0, cloudinary_util_1.default)(file);
                    if (!uploadResult) {
                        return next(new errorhandler_util_1.default(500, "Failed to upload image"));
                    }
                    updateData.profileUrl = uploadResult.secure_url; // Store the Cloudinary URL
                }
                // Update user profile
                const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select("-passwordHash -refreshToken");
                if (!updatedUser) {
                    return next(new errorhandler_util_1.default(404, "User not found"));
                }
                res.status(200).json({
                    message: "Profile updated successfully",
                    user: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
