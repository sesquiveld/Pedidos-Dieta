import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const PedidoEmpaque = sequelize.define("PedidoEmpaque", {
  id_pedido: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, },
  id_empaque: { type: DataTypes.INTEGER, allowNull: false,primaryKey: true, },
  cantidad: { type: DataTypes.INTEGER, allowNull: false,},
  precio_empaque: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0,},
  precio_tempaques: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0,},
}, { tableName: "pedidoempaque", timestamps: false, freezeTableName: true });  // evita que Sequelize pluralice 

export default PedidoEmpaque;
