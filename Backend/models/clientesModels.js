import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Cliente = sequelize.define("Cliente", {
  id_cliente: { type: DataTypes.STRING(15), primaryKey: true },
  nombre: { type: DataTypes.STRING(15), allowNull: false },
  tipo: { type: DataTypes.STRING(10) },
  Ciudad: { type: DataTypes.STRING(10) },
  direccion: { type: DataTypes.STRING(20) },
  contacto: { type: DataTypes.STRING(15) },
  telefono: { type: DataTypes.INTEGER },
  activo: { type: DataTypes.BOOLEAN },
  correo:{type: DataTypes.STRING(45),} },

 {
  tableName: "cliente", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
});

export default Cliente;