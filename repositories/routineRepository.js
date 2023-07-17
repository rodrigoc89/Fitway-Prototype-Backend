const { Routine, Tag, Exercise, SuperSet } = require("../model");

const findByCode = async (codeShare) => {
  return await Routine.findOne({
    where: { public: true, codeShare: codeShare },
    include: [
      {
        model: Tag,
        through: { attributes: [] },
      },
    ],
  });
};

const findById = async (routineId) => {
  return await Routine.findByPk(routineId);
};

const getData = async (routineId) => {
  return await Routine.findByPk(routineId, {
    attributes: { exclude: ["UserId"] },
    include: [
      {
        model: Exercise,
        through: { attributes: [] },
      },
      {
        model: SuperSet,
        through: { attributes: [] },

        include: {
          model: Exercise,
          through: { attributes: [] },
        },
      },
      {
        model: Tag,
        through: { attributes: [] },
      },
    ],
  });
};

const create = async (routineData) => {
  return await Routine.create(routineData);
};

const eliminate = async (routineId) => {
  return await Routine.destroy({ where: { id: routineId } });
};

module.exports = {
  findByCode,
  findById,
  getData,
  create,
  eliminate,
};
