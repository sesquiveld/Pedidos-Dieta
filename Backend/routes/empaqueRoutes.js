import { Router } from "express";
import {
  createEmpaque, getEmpaques, getEmpaqueById, updateEmpaque, deleteEmpaque
} from "../controllers/empaqueController.js";

const router = Router();
router.post("/", createEmpaque);
router.get("/", getEmpaques);
router.get("/:id", getEmpaqueById);
router.put("/:id", updateEmpaque);
router.delete("/:id", deleteEmpaque);
export default router;