import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Cliente = sequelize.define("Cliente", {
  ID_CLIENTE: { type: DataTypes.STRING(5), primaryKey: true },
  NOMBRE: { type: DataTypes.STRING(15), allowNull: false },
  TIPO: { type: DataTypes.STRING(10) },
  CIUDAD: { type: DataTypes.STRING(10) },
  DIRECCION: { type: DataTypes.STRING(20) },
  CONTACTO: { type: DataTypes.STRING(15) },
  TELEFONO: { type: DataTypes.INTEGER },
});

export default Cliente;
