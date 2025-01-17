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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    passwordHash: {
        type: String,
        required: true,
    },
    passwordResetToken: {
        type: String,
        default: null,
    },
    passwordResetExpires: {
        type: Date,
        default: null,
    },
    profileUrl: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifycode: {
        type: String,
        required: [true, "verication code is required"],
    },
    VerifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"],
    },
    refreshToken: {
        type: String,
        default: null,
    },
    roles: {
        type: [String],
        enum: ["User", "Admin", "Moderator"],
        default: ["User"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    ForgotPasswordResetToken: {
        type: String,
    },
    ForgotPasswordResetTokenExpiry: {
        type: Date,
    },
});
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
const UserModel = mongoose_1.default.model("useraccount", userSchema);
exports.default = UserModel;
