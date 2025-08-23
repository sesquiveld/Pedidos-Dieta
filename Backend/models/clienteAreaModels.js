import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const ClienteArea = sequelize.define("ClienteArea", {
  ID_CLIENTE: { type: DataTypes.STRING(5), allowNull: false },
  ID_AREA: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false });

export default ClienteArea;
