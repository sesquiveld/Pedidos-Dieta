import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const PedidoDieta = sequelize.define("PedidoDieta", {
  id_pedido: { type: DataTypes.INTEGER, allowNull: false },
  codigo_dieta: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, { timestamps: false, tableName: "pedidodieta" });

export default PedidoDieta;

