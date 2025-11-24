import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const ClienteArea = sequelize.define("ClienteArea", {
  id_cliente: { type: DataTypes.STRING(15), allowNull: false },
  id_area: { type: DataTypes.INTEGER, allowNull: false },
}, {tableName: "clientearea", timestamps: false, freezeTableName: true  });

export default ClienteArea;
