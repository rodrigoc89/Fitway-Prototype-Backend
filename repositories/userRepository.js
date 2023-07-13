const { User, Routine, Exercise, SuperSet, Tag } = require("../model");
const { Op } = require("sequelize");

const findByEmailOrUsername = async (userLogin) => {
  return User.findOne({
    where: {
      [Op.or]: [{ email: userLogin }, { username: userLogin }],
    },
  });
};

const createUser = async (
  name,
  lastName,
  birthdate,
  password,
  email,
  country,
  username
) => {
  return User.create({
    name,
    lastName,
    birthdate,
    password,
    email,
    country,
    username,
  });
};

const validateEmail = async (email) => {
  return User.findOne({ where: { email: email } });
};

const findById = async (userId) => {
  return User.findByPk(userId);
};

const findExercises = async (userId) => {
  return Exercise.findAll({ where: { UserId: userId } });
};

const findSuperSets = async (userId) => {
  return SuperSet.findAll({ where: { UserId: userId } });
};

module.exports = {
  findByEmailOrUsername,
  createUser,
  validateEmail,
  findById,
  findExercises,
  findSuperSets,
};
