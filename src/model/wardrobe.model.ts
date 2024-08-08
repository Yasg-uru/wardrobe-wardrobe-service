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
      required: [true, "image is required"],
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
ClotheSchema.index({ category: 1, color: 1 });
ClotheSchema.index({ brand: 1 });
ClotheSchema.index({ material: 1 });
ClotheSchema.index({ wearCount: -1 });
ClotheSchema.index({ isFavorite: 1 });
const ClothModel = mongoose.model<IClothinItem>("ClothItem", ClotheSchema);
export default ClothModel;
