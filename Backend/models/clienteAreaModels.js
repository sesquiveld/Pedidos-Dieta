import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const ClienteArea = sequelize.define("ClienteArea", {
  id_cliente: { type: DataTypes.STRING(5), allowNull: false },
  id_area: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

export default ClienteArea;
