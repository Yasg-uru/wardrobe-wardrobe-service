import mongoose, { Document, Schema } from "mongoose";
export interface IClothinItem extends Document {
  userId: string;
  imageurl: string;
  category: "Top" | "Bottom" | "Accessory" | "Footwear" | "Outerwear" | "Other";
  color: string;
  size: string;
  brand: string;
  material: string;
  tags: string[];
  purchaseDate: Date;
  condition: "New" | "Good" | "Worn" | "Needs Repair";
  wearcount: number;
  lastWorn: Date;
  cost: number;
  isFavorite: boolean;
  isArchived: boolean;
  isFormal: boolean;
  weatherSuitability: {
    isRainSuitable: boolean;
    isWindSuitable: boolean;
    isSunnySuitable: boolean;
    isCloudySuitable: boolean;
    isSnowySuitable: boolean;
  };
  seasonSuitability: {
    isSummer: boolean;
    isWinter: boolean;
    isSpring: boolean;
    isAutumn: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
const ClotheSchema: Schema = new Schema<IClothinItem>(
  {
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
  },
  {
    timestamps: true,
  }
);
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
ClotheSchema.index({ wearCount: -1 });
ClotheSchema.index({ isFavorite: 1 });
const ClothModel = mongoose.model<IClothinItem>("ClothItem", ClotheSchema);
export default ClothModel;
