const Sequelize = require("sequelize");
const db = require("../db/index");

class SuperSet extends Sequelize.Model {}

SuperSet.init(
  {
    name: {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    reps: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    rest: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "SuperSet", timestamps: false }
);

module.exports = SuperSet;
