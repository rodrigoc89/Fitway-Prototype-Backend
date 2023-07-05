const Sequelize = require("sequelize");
const db = require("../db/index");
const crypto = require("crypto");

class Routine extends Sequelize.Model {}

Routine.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    selectDay: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    creator: {
      type: Sequelize.STRING,
    },
    public: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    codeShare: {
      type: Sequelize.STRING,
    },
  },
  { sequelize: db, modelName: "Routine", timestamps: false }
);

Routine.prototype.generateShareCode = async function () {
  const routineIdStr = String(this.id);
  const hash = crypto.createHash("md5").update(routineIdStr).digest("hex");
  const shareCode = hash.substring(0, 8);
  return shareCode;
};

module.exports = Routine;
