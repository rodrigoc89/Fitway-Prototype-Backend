const { Routine, Tag, Exercise, SuperSet } = require("../model");

const findById = async (routineId) => {
  return await Routine.findByPk(routineId, {
    include: [{ model: Tag, through: { attributes: [] } }],
  });
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
  findById,
  getData,
  create,
  eliminate,
};
