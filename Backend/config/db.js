// backend/config/db.js
/*import { Sequelize } from "sequelize";

const sequelize = new Sequelize("DIETAS", "root", "Mercedes191513.", {
  host: "localhost",
  dialect: "mysql",
  port: 3306, // este es el puerto por defecto de MySQL Workbench
  logging: false,
});

export default sequelize;*/

// backend/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: { timestamps: false }
  }
);

export default sequelize;
