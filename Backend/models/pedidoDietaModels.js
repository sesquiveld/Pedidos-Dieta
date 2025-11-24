import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const PedidoDieta = sequelize.define("PedidoDieta", {
  id_pedido: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true,},
  codigo_dieta: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0,},
  precio_tdietas: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0,},
}, { timestamps: false, tableName: "pedidodieta" , freezeTableName: true }); // evita que Sequelize pluralice 

export default PedidoDieta;

