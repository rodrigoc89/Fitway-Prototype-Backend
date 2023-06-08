const Sequelize = require("sequelize");
const db = require("../db/index");

class Routine extends Sequelize.Model {}

Routine.init(
  {
    name: {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    selectDay: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "Routine", timestamps: false }
);

module.exports = Routine;
