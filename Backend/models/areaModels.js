import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Area = sequelize.define("Area", {
  ID_AREA: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NOMBRE_AREA: { type: DataTypes.STRING(10), allowNull: false },
});

export default Area;
