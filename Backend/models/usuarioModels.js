import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Usuario = sequelize.define("Usuario", {
  id_usuario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_usuario: { type: DataTypes.STRING(20), allowNull: false },
  correo_usuario: { type: DataTypes.STRING(40), allowNull: false },
  contrasena: { type: DataTypes.STRING(15) },
  tipo_usuario: { type: DataTypes.ENUM("Administrador", "Nutricionista", "Cocina", "Enfermeria", "Usuario"), allowNull: false },
  ACTIVO: { type: DataTypes.BOOLEAN },
}, { tableName: "usuario", timestamps: false });

export default Usuario;
