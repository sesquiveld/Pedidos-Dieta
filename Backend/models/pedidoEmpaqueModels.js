import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const PedidoEmpaque = sequelize.define("PedidoEmpaque", {
  id_pedido: { type: DataTypes.INTEGER, allowNull: false },
  id_empaque: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: "pedidoempaque", timestamps: false });

export default PedidoEmpaque;
