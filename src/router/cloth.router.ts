import { Router } from "express";
import upload from "../middleware/multer.middleware";
import ClothController from "../controller/cloth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";
const clothRouter = Router();
clothRouter.post(
  "/create",
  upload.single("imageurl"),
  isAuthenticated,
  ClothController.create
);
clothRouter.delete("/:clothId", isAuthenticated, ClothController.delete);
clothRouter.get("/", isAuthenticated, ClothController.Recommandationwheather);
clothRouter.get("/search", isAuthenticated, ClothController.SearchCloths);
clothRouter.get("/filter", isAuthenticated, ClothController.filter);
clothRouter.post("/wear/:clothId", isAuthenticated, ClothController.Wear);
clothRouter.get(
  "/details/:clothId",
  isAuthenticated,
  ClothController.GetClothInfo
);
clothRouter.get(
  "/wear/analysis",
  isAuthenticated,
  ClothController.GetWearAnalysis
);
clothRouter.get(
  "/collections",
  isAuthenticated,
  ClothController.GetCollections
);
clothRouter.get("/reminder", isAuthenticated, ClothController.getReminder);
clothRouter.get("/archive", isAuthenticated, ClothController.GetArchiveCloths);
clothRouter.put("/remove-archive/:clothId", isAuthenticated, ClothController.RemoveFromArchive);

export default clothRouter;
