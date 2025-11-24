
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Dietas", "root", "Mercedes191513.", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // puedes poner true para ver las queries en consola
});

export default sequelize;
