import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const PedidoEmpaque = sequelize.define("PedidoEmpaque", {
  ID_PEDIDO: { type: DataTypes.INTEGER, allowNull: false },
  ID_EMPAQUE: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

export default PedidoEmpaque;
