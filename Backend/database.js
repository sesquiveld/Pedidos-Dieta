/*import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
*/
// backend/database.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Dietas", "root", "Mercedes191513.", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // puedes poner true para ver las queries en consola
});

export default sequelize;
