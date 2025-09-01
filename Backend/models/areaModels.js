import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Area = sequelize.define("Area", {
  id_area: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_area: { type: DataTypes.STRING(10), allowNull: false },
  descripcion: { type: DataTypes.STRING(45), allowNull: true },
  ubicacion: { type: DataTypes.STRING(45), allowNull: true },},
 {tableName: "area", timestamps: false });

export default Area;
