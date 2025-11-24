import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const UsuarioPedido = sequelize.define("UsuarioPedido", {
  id_usuario: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, },
  id_pedido: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, },

}, { tableName: "usuariopedido",timestamps: false });

export default UsuarioPedido;
