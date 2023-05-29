const Sequelize = require("sequelize");

const db = new Sequelize("fitway", null, null, {
  host: "localhost",
  dialect: "postgresql",
  logging: false,
});

module.exports = db