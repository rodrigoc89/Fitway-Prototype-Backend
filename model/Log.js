const Sequelize = require("sequelize");
const db = require("../db/index");

class Log extends Sequelize.Model {}

Log.init(
  {
    time: {
      type: Sequelize.INTEGER(),
    },
    muscles: {
      type: Sequelize.ARRAY(Sequelize.STRING()),
    },
    day: {
      type: Sequelize.STRING(),
    },
    date: Sequelize.DATE,
  },
  {
    sequelize: db,
    modelName: "Logs",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: [] },
    },
  }
);

module.exports = Log;
