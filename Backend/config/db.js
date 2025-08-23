// backend/config/db.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("DIETAS", "root", "Mercedes191513.", {
  host: "localhost",
  dialect: "mysql",
  port: 3306, // este es el puerto por defecto de MySQL Workbench
  logging: false,
});

export default sequelize;