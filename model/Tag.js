const Sequelize = require("sequelize");
const db = require("../db/index");

class Tag extends Sequelize.Model {}

Tag.init(
  {
    tagName: {
      type: Sequelize.STRING(),
    },
  },
  {
    sequelize: db,
    modelName: "Tag",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: [] },
    },
  }
);

module.exports = Tag;
