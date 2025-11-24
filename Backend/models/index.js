// backend/models/index.js
import sequelize from "../config/db.js";
import Cliente from "./clientesModels.js";
import Area from "./areaModels.js";
import Dieta from "./dietaModels.js";
import Empaque from "./empaqueModels.js";
import Usuario from "./usuarioModels.js";
import Pedido from "./pedidoModels.js";
import ClienteArea from "./clienteAreaModels.js";
import PedidoDieta from "./pedidoDietaModels.js";
import PedidoEmpaque from "./pedidoEmpaqueModels.js";
import UsuarioPedido from "./usuarioPedidoModels.js";
import ClienteDieta from "./clienteDietaModels.js";

// Relaciones M:N Cliente ↔ Área
Cliente.belongsToMany(Area, {
  through: ClienteArea,
  foreignKey: "id_cliente",
  otherKey: "id_area",
});
Area.belongsToMany(Cliente, {
  through: ClienteArea,
  foreignKey: "id_area",
  otherKey: "id_cliente",
});

// Relaciones M:N Cliente ↔ Dieta
Cliente.belongsToMany(Dieta, {
  through: ClienteDieta,
  foreignKey: "id_cliente",
  otherKey: "codigo_dieta",
});
Dieta.belongsToMany(Cliente, {
  through: ClienteDieta,
  foreignKey: "codigo_dieta",
  otherKey: "id_cliente",
});



// Pedido pertenece a Cliente y Área
Pedido.belongsTo(Cliente, { foreignKey: "id_cliente" });
Pedido.belongsTo(Area, { foreignKey: "id_area" });
Cliente.hasMany(Pedido, { foreignKey: "id_cliente" });
Area.hasMany(Pedido, { foreignKey: "id_area" });

// Pedido M:N Dieta con cantidad en tabla puente
Pedido.belongsToMany(Dieta, {
  through: PedidoDieta,
  foreignKey: "id_pedido",
  otherKey: "codigo_dieta",
  targetKey: "codigo_dieta",
 
});
Dieta.belongsToMany(Pedido, {
  through: PedidoDieta,
  foreignKey: "codigo_dieta",
  otherKey: "id_pedido",
   targetKey: "id_pedido",
  
});


// 🔥 Necesario para que funcione include en ClienteDieta
ClienteDieta.belongsTo(Cliente, { foreignKey: "id_cliente" });
ClienteDieta.belongsTo(Dieta, { foreignKey: "codigo_dieta" });

// Pedido M:N Empaque con cantidad
Pedido.belongsToMany(Empaque, {
  through: PedidoEmpaque,
  foreignKey: "id_pedido",
  otherKey: "id_empaque",
   
});
Empaque.belongsToMany(Pedido, {
  through: PedidoEmpaque,
  foreignKey: "id_empaque",
  otherKey: "id_pedido",
  
});

// 🔧 Relaciones directas entre Pedido y PedidoDieta (para update/findByPk)
Pedido.hasMany(PedidoDieta, { foreignKey: "id_pedido", onDelete: "CASCADE" });
PedidoDieta.belongsTo(Pedido, { foreignKey: "id_pedido" });

// 🔧 Relaciones directas entre Pedido y PedidoEmpaque
Pedido.hasMany(PedidoEmpaque, { foreignKey: "id_pedido", onDelete: "CASCADE" });
PedidoEmpaque.belongsTo(Pedido, { foreignKey: "id_pedido" });

// Un pedido pertenece a un usuario
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Un usuario puede tener muchos pedidos
Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });


// Un cliente tiene muchos pedidos
Cliente.hasMany(Pedido, { foreignKey: "id_cliente" });

// Un pedido pertenece a un cliente
Pedido.belongsTo(Cliente, { foreignKey: "id_cliente" });

/*
// Usuario M:N Pedido (asignación/registro)
Usuario.belongsToMany(Pedido, {
  through: UsuarioPedido,
  foreignKey: "id_usuario",
  otherKey: "id_pedido",
});
Pedido.belongsToMany(Usuario, {
  through: UsuarioPedido,
  foreignKey: "id_pedido",
  otherKey: "id_usuario",
});
*/
export {
  sequelize,
  Cliente,
  Area,
  Dieta,
  Empaque,
  Usuario,
  Pedido,
  ClienteArea,
  PedidoDieta,
  PedidoEmpaque,
  UsuarioPedido,
  ClienteDieta,
};


