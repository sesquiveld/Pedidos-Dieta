import { Router } from "express";
import {
  reporteResumenFechas,
  reportePorCliente,
  reportePorAreaTipo,
  reportePicklistCocina,
  reporteFacturacion,
  reporteTotalesDietasCliente,
  reporteTotalesDietasClienteArea,
  descargarFacturacionExcel,
  descargarResumenFechasExcel,
  descargarPicklistCocinaExcel,
  descargarPicklistCocinaPDF,
  descargarPorAreaTipoExcel,
  descargarTotalesDietasClienteExcel,
  descargarTotalesDietasClienteAreaExcel,
  descargarFacturaPlantillaExcel

} from "../controllers/reportesController.js";

const router = Router();

router.get("/resumen-fechas", reporteResumenFechas);
router.get("/por-cliente", reportePorCliente);
router.get("/por-area-tipo", reportePorAreaTipo);
router.get("/picklist-cocina", reportePicklistCocina);
router.get("/facturacion", reporteFacturacion);
router.get("/totales-dietas-cliente", reporteTotalesDietasCliente);
router.get("/totales-dietas-cliente-area", reporteTotalesDietasClienteArea);

// Descargar los reportes en Excel
router.get("/facturacion-excel", descargarFacturacionExcel);
router.get("/resumen-fechas-excel", descargarResumenFechasExcel);
router.get("/picklist-cocina-excel", descargarPicklistCocinaExcel);
router.get("/picklist-cocina-pdf", descargarPicklistCocinaPDF);
router.get("/por-area-tipo-excel", descargarPorAreaTipoExcel);
router.get("/totales-dietas-cliente-excel", descargarTotalesDietasClienteExcel);
router.get("/totales-dietas-cliente-area-excel", descargarTotalesDietasClienteAreaExcel);
router.get("/factura-plantilla-excel", descargarFacturaPlantillaExcel);

export default router;
