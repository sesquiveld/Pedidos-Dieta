import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Dieta = sequelize.define("Dieta", {
  codigo_dieta: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  nombre_dieta: { type: DataTypes.STRING(15), allowNull: false },
},  {
  tableName: "dieta", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
  freezeTableName: true, 
});

export default Dieta;


