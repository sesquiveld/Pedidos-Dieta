import Cliente from "./clienteModels.js";
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
