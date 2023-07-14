const { SuperSet, Exercise } = require("../model");

const findById = async (supersetId) => {
  return await SuperSet.findByPk(supersetId, {
    include: {
      model: Exercise,
      through: { attributes: [] },
    },
  });
};

const create = async (superSetData) => {
  return await SuperSet.create(superSetData);
};

const eliminate = async (supersetId) => {
  return await SuperSet.destroy({ where: { id: supersetId } });
};

module.exports = {
  findById,
  create,
  eliminate,
};
