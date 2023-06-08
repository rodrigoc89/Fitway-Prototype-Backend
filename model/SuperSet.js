const Sequelize = require("sequelize");
const db = require("../db/index");

class SuperSet extends Sequelize.Model {}

SuperSet.init({}, { sequelize: db, modelName: "SuperSet", timestamps: false });

module.exports = SuperSet;
