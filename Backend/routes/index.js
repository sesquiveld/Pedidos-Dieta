import { Router } from "express";
import clienteRoutes from "./clienteRoutes.js";
import areaRoutes from "./areaRoutes.js";
import dietaRoutes from "./dietaRoutes.js";
import empaqueRoutes from "./empaqueRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";

const router = Router();

router.use("/clientes", clienteRoutes);
router.use("/areas", areaRoutes);
router.use("/dietas", dietaRoutes);
router.use("/empaques", empaqueRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/pedidos", pedidoRoutes);

export default router;


/*import express from "express";
import clienteRoutes from "./clienteRoutes.js";
import areaRoutes from "./areaRoutes.js";
import dietaRoutes from "./dietaRoutes.js";
import empaqueRoutes from "./empaqueRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";

const router = express.Router();

router.use("/clientes", clienteRoutes);
router.use("/areas", areaRoutes);
router.use("/dietas", dietaRoutes);
router.use("/empaques", empaqueRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/pedidos", pedidoRoutes);

export default router;
*/