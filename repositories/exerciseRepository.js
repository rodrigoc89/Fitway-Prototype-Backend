const { Exercise } = require("../model");

const findById = async (exerciseId) => {
  return await Exercise.findByPk(exerciseId);
};

const create = async (exerciseData) => {
  return await Exercise.create(exerciseData);
};

const deleted = async (exerciseId) => {
  return await Exercise.destroy({ where: { id: exerciseId } });
};

module.exports = {
  findById,
  create,
  deleted,
};
