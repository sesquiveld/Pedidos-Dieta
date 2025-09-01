import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const DietaCliente = sequelize.define("DietaCliente", {
  codigo_dieta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.STRING(15), allowNull: false },
  precio_dieta: { type: DataTypes.INTEGER, allowNull: false },

},  {
  tableName: "dietacliente", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
});

export default DietaCliente; 