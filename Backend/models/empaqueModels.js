import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Empaque = sequelize.define("Empaque", {
  id_empaque: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_empaque: { type: DataTypes.STRING(15), allowNull: false },
  caracteristicas :{ type : DataTypes.STRING(45), allowNull: false},
  precio_empaque: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "empaque", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
});

export default Empaque;
