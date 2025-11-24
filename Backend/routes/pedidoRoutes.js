
import { Router } from "express";
import {
  createPedido, 
  getPedidos, 
  getPedidoById, 
  updatePedido, 
  deletePedido,
  //getPedidosPorCliente,
  //getPedidosPorFecha,
  //getResumenPedidos,
  //exportReporteExcel,
  reportPorCliente, 
  reportPorFecha,
  printPedido, facturaCliente
} from "../controllers/pedidoController.js";
import { reportPorUsuario } from "../controllers/pedidoController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = Router();
router.use(authMiddleware); // 👈 todas protegidas

router.post("/", createPedido);
router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.put("/:id", updatePedido);
router.delete("/:id", deletePedido);


// 📊 Reportes


// Reportes
router.get("/reportes/por-cliente", reportPorCliente);
router.get("/reportes/por-fecha", reportPorFecha);

router.get("/:id/print", printPedido);
router.get("/factura/cliente", facturaCliente);

router.get("/reportes/usuarios", reportPorUsuario);


//router.get("/reportes/por-cliente", getPedidosPorCliente);
//router.get("/reportes/por-fecha", getPedidosPorFecha);
//router.get("/reportes/resumen", getResumenPedidos);

//Excel
//router.get("/reportes/excel", exportReporteExcel);

export default router;
