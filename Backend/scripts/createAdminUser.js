import bcrypt from "bcryptjs";
import Usuario from "../models/usuarioModels.js"; 
import sequelize from "../database.js";

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a DB correcta ✅");

    // Hashear la contraseña
    const hash = await bcrypt.hash("1234", 10);

    // Crear usuario
    const admin = await Usuario.create({
      id_usuario: 1, // puedes cambiarlo
      nombre_usuario: "Administrador",
      correo_usuario: "admin@hospital.com",
      contrasena: hash,
      tipo_usuario: "Administrador",
      ACTIVO: true,
    });

    console.log("Usuario administrador creado ✅", admin.toJSON());
    process.exit(0);
  } catch (error) {
    console.error("Error creando admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
