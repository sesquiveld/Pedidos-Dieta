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
});
Dieta.belongsToMany(Pedido, {
  through: PedidoDieta,
  foreignKey: "codigo_dieta",
  otherKey: "id_pedido",
});

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


/*
import Cliente from "./clientesModels.js";
import Area from "./areaModels.js";
import ClienteArea from "./clienteAreaModels.js";
import Dieta from "./dietaModels.js";
import Empaque from "./empaqueModels.js";
import Usuario from "./usuarioModels.js";
import Pedido from "./pedidoModels.js";
import PedidoDieta from "./pedidoDietaModels.js";
import PedidoEmpaque from "./pedidoEmpaqueModels.js";
import UsuarioPedido from "./usuarioPedidoModels.js";

Pedido.belongsTo(Cliente, { foreignKey: "ID_CLIENTE" });
Cliente.hasMany(Pedido, { foreignKey: "ID_CLIENTE" });
Pedido.belongsTo(Area, { foreignKey: "ID_AREA" });
Area.hasMany(Pedido, { foreignKey: "ID_AREA" });

// Cliente ↔ Area (N:M)
Cliente.belongsToMany(Area, { through: ClienteArea, foreignKey: "ID_CLIENTE" });
Area.belongsToMany(Cliente, { through: ClienteArea, foreignKey: "ID_AREA" });

// Pedido ↔ Dieta (N:M)
Pedido.belongsToMany(Dieta, { through: PedidoDieta, foreignKey: "ID_PEDIDO" });
Dieta.belongsToMany(Pedido, { through: PedidoDieta, foreignKey: "CODIGO_DIETA" });

// Pedido ↔ Empaque (N:M)
Pedido.belongsToMany(Empaque, { through: PedidoEmpaque, foreignKey: "ID_PEDIDO" });
Empaque.belongsToMany(Pedido, { through: PedidoEmpaque, foreignKey: "ID_EMPAQUE" });

// Usuario ↔ Pedido (N:M)
Usuario.belongsToMany(Pedido, { through: UsuarioPedido, foreignKey: "ID_USUARIO" });
Pedido.belongsToMany(Usuario, { through: UsuarioPedido, foreignKey: "ID_PEDIDO" });

export {
  Cliente,
  Area,
  ClienteArea,
  Dieta,
  Empaque,
  Usuario,
  Pedido,
  PedidoDieta,
  PedidoEmpaque,
  UsuarioPedido,
};
*/