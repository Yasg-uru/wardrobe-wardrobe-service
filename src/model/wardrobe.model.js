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
const ClotheSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, "userid is required"],
        index: true,
    },
    imageurl: {
        type: String,
        // required: [true, "image is required"],
    },
    category: {
        type: String,
        required: [true, "category is required"],
        enum: ["Top", "Bottom", "Accessory", "Footwear", "Outerwear", "Other"],
    },
    color: {
        type: String,
        required: [true, "color is required"],
    },
    size: {
        type: String,
        required: [true, "size is required"],
    },
    brand: {
        type: String,
        required: [true, "brand is required"],
    },
    material: {
        type: String,
        required: [true, "material is required"],
    },
    tags: [String],
    purchaseDate: {
        type: Date,
        required: [true, "purchase data is required"],
    },
    condition: {
        type: String,
        enum: ["New", "Good", "Worn", "Needs Repair"],
        default: "New",
    },
    wearcount: {
        type: Number,
        default: 0,
        index: true,
    },
    lastWorn: {
        type: Date,
        default: null,
    },
    cost: {
        type: Number,
        required: [true, "cost of the cloth is required"],
        min: 0,
    },
    seasonSuitability: {
        isWinter: {
            type: Boolean,
            default: false,
        },
        isSummer: {
            type: Boolean,
            default: false,
        },
        isSpring: {
            type: Boolean,
            default: false,
        },
        isAutumn: {
            type: Boolean,
            default: false,
        },
    },
    weatherSuitability: {
        isWindSuitable: {
            type: Boolean,
            default: false,
        },
        isRainSuitable: {
            type: Boolean,
            default: false,
        },
        isSnowySuitable: {
            type: Boolean,
            default: false,
        },
        isCloudySuitable: {
            type: Boolean,
            default: false,
        },
        isSunnySuitable: {
            type: Boolean,
            default: false,
        },
    },
    isFavorite: {
        type: Boolean,
        default: false,
        index: true,
    },
    isArchived: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});
ClotheSchema.index({
    category: "text",
    color: "text",
    brand: "text",
    material: "text",
    tags: "text",
});
ClotheSchema.index({ category: 1, color: 1 });
ClotheSchema.index({ brand: 1 });
ClotheSchema.index({ material: 1 });
ClotheSchema.index({ wearcount: -1 });
ClotheSchema.index({ isFavorite: 1 });
const ClothModel = mongoose_1.default.model("ClothItem", ClotheSchema);
exports.default = ClothModel;
