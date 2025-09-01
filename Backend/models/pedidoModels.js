import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Pedido = sequelize.define("Pedido", {
  id_pedido: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_comida: { type: DataTypes.ENUM("Desayuno", "Almuerzo", "Comida", "Merienda"), allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  estado_pedido: { type: DataTypes.ENUM("Pendiente", "Listo", "Cancelado"), allowNull: false },
  observaciones: { type: DataTypes.STRING(100), allowNull: true },
  id_cliente: { type: DataTypes.STRING(5), allowNull: false },
  id_area: { type: DataTypes.INTEGER, allowNull: false },
  id_usuario: { type: DataTypes.INTEGER, allowNull: true  },
  codigo_dieta: {type: DataTypes.INTEGER, allowNull: true } 

},{ tableName: "pedido", timestamps: false });

export default Pedido;

