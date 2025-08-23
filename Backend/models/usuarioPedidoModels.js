import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const UsuarioPedido = sequelize.define("UsuarioPedido", {
  ID_USUARIO: { type: DataTypes.INTEGER, allowNull: false },
  ID_PEDIDO: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

export default UsuarioPedido;
