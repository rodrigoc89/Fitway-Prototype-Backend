const Sequelize = require("sequelize");
require("dotenv").config();

const dbConfig = {
  db_name: process.env.DB_NAME || process.env.PGDATABASE,
  db_user: process.env.DB_USER || process.env.PGUSER,
  db_password: process.env.DB_PASSWORD || process.env.PGPASSWORD,
  db_host: process.env.DB_HOST || process.env.PGHOST,
  db_dialect: process.env.DB_DIALECT || "postgres",
  logging: false,
};

const db = new Sequelize(
  dbConfig.db_name,
  dbConfig.db_user,
  dbConfig.db_password,
  {
    host: dbConfig.db_host,
    dialect: dbConfig.db_dialect,
    logging: dbConfig.logging,
  }
);

module.exports = db;
