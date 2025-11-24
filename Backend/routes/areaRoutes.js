
import { Router } from "express";
import {
  createArea, getAreas, getAreaById, updateArea, deleteArea
} from "../controllers/areaController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware); // 👈 todas protegidas
router.post("/", createArea);
router.get("/", getAreas);
router.get("/:id", getAreaById);
router.put("/:id", updateArea);
router.delete("/:id", deleteArea);
export default router;
