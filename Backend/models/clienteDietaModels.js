import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const ClienteDieta = sequelize.define("DietaCliente", {
  codigo_dieta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.STRING(15), primaryKey:true, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

},  {
  tableName: "clientedieta", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
  freezeTableName: true, 
});

export default ClienteDieta; 