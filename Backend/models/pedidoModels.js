import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Pedido = sequelize.define("Pedido", {
  ID_PEDIDO: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  TIPO_COMIDA: { type: DataTypes.ENUM("Desayuno", "Almuerzo", "Comida", "Merienda"), allowNull: false },
  CANTIDAD: { type: DataTypes.INTEGER, allowNull: false },
  FECHA: { type: DataTypes.DATEONLY, allowNull: false },
  ID_CLIENTE: { type: DataTypes.STRING(5), allowNull: false },
  ID_AREA: { type: DataTypes.INTEGER, allowNull: false },
},{ tableName: "Pedido", timestamps: false });

export default Pedido;

