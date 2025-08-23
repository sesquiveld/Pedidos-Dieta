import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Dieta = sequelize.define("Dieta", {
  CODIGO_DIETA: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NOMBRE_DIETA: { type: DataTypes.STRING(15), allowNull: false },
  PRECIO_DIETA: { type: DataTypes.INTEGER, allowNull: false },
});

export default Dieta;
