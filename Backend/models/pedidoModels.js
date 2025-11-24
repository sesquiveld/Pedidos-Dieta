
import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Pedido = sequelize.define("Pedido", {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cliente: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  id_area: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  tipo_comida: {
    type: DataTypes.ENUM("Desayuno", "Almuerzo", "Comida", "Merienda"),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_pedido: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado_pedido: {
    type: DataTypes.ENUM("Pendiente", "Listo", "Cancelado"),
    allowNull: false,
    defaultValue: "Pendiente",
  },
}, {
  tableName: "pedido",
  timestamps: false,
  freezeTableName: true,     // evita que Sequelize pluralice
});

export default Pedido;
