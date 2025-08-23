import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Usuario = sequelize.define("Usuario", {
  ID_USUARIO: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NOMBRE_USUARIO: { type: DataTypes.STRING(20), allowNull: false },
  CORREO_USUARIO: { type: DataTypes.STRING(40), allowNull: false },
  CONTRASENA: { type: DataTypes.STRING(15) },
  TIPO_USUARIO: { type: DataTypes.STRING(10) },
  ACTIVO: { type: DataTypes.BOOLEAN },
});

export default Usuario;
