const Sequelize = require("sequelize");
const db = require("../db/index");
const bcrypt = require("bcrypt");

class User extends Sequelize.Model {}
User.init(
  {
    nickname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Field nickname cannot be null",
        },
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Field name cannot be null",
        },
      },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Field lastName cannot be null",
        },
      },
    },

    birthdate: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Field birthdate cannot be null",
        },
      },
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Field country cannot be null",
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "The field email has to be valid email",
        },
        notNull: {
          msg: "Field email cannot be null",
        },
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Field password cannot be null",
        },
      },
    },
    salt: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: [] },
    },
  }
);

User.prototype.hash = function (password, salt) {
  return bcrypt.hash(password, salt);
};

User.prototype.validatePassword = async function (password) {
  const hashed = await this.hash(password, this.salt);
  return hashed === this.password;
};

User.addHook("beforeValidate", (user) => {
  const salt = bcrypt.genSaltSync();
  user.salt = salt;

  return user.hash(user.password, user.salt).then((hashed) => {
    user.password = hashed;
  });
});

module.exports = User;
