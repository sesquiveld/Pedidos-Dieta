import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const PedidoDieta = sequelize.define("PedidoDieta", {
  ID_PEDIDO: { type: DataTypes.INTEGER, allowNull: false },
  CODIGO_DIETA: { type: DataTypes.INTEGER, allowNull: false },
  CANTIDAD: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, { timestamps: false, tableName: "PedidoDieta" });

export default PedidoDieta;
