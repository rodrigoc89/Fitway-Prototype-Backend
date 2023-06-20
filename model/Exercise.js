const Sequelize = require("sequelize");
const db = require("../db/index");

class Exercise extends Sequelize.Model {}

Exercise.init(
  {
    name: {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    reps: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    element: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    rest: {
      type: Sequelize.INTEGER,
    },
    muscle: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    series: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    order: {
      type: Sequelize.INTEGER,
    },
  },
  { sequelize: db, modelName: "Exercise", timestamps: false }
);

module.exports = Exercise;
