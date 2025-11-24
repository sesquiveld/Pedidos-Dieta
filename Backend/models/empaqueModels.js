import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Empaque = sequelize.define("Empaque", {
  id_empaque: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  nombre_empaque: { type: DataTypes.STRING(45), allowNull: false },
  caracteristicas :{ type : DataTypes.STRING(45), allowNull: true},
  precio_empaque: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: "empaque", // 👈 muy importante
  timestamps: false,    // si no tienes createdAt / updatedAt en la tabla
  freezeTableName: true, 
});

export default Empaque;


