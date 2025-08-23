import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Empaque = sequelize.define("Empaque", {
  ID_EMPAQUE: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NOMBRE_EMPAQUE: { type: DataTypes.STRING(15), allowNull: false },
  PRECIO_EMPAQUE: { type: DataTypes.INTEGER, allowNull: false },
});

export default Empaque;
