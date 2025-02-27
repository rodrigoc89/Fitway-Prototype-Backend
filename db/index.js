const Sequelize = require("sequelize");
require("dotenv").config();

const dbConfig = {
  db_name: process.env.DB_NAME,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,
  db_dialect: process.env.DB_DIALECT || "postgres",
  db_port: process.env.PORT,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
};

const db = new Sequelize(
  dbConfig.db_name,
  dbConfig.db_user,
  dbConfig.db_password,
  {
    host: dbConfig.db_host,
    dialect: dbConfig.db_dialect,
    logging: dbConfig.logging,
    port: dbConfig.db_port,
    pool: dbConfig.pool,
  }
);

module.exports = db;
