import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Dieta = sequelize.define("Dieta", {
  codigo_dieta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_dieta: { type: DataTypes.STRING(15), allowNull: false },
},  {
  tableName: "dieta", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
});

export default Dieta;
