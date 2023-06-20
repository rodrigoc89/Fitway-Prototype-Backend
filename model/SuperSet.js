const Sequelize = require("sequelize");
const db = require("../db/index");

class SuperSet extends Sequelize.Model {}

SuperSet.init(
  {
    order: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "SuperSet", timestamps: false }
);

module.exports = SuperSet;
