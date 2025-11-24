import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Area = sequelize.define("Area", {
  id_area: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  nombre_area: { type: DataTypes.STRING(45), allowNull: false },
  descripcion: { type: DataTypes.STRING(45), allowNull: true },
  ubicacion: { type: DataTypes.STRING(45), allowNull: true },},
 {tableName: "area", timestamps: false, freezeTableName: true  });

export default Area;


