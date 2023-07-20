const Router = require("express");
const { Routine, Exercise, SuperSet, Tag } = require("../model");
const { Op } = require("sequelize");

const router = Router();

router.get("/", async (req, res) => {
  const searchQuery = req.query.textSearch;
  try {
    const result = await Routine.findAll({
      where: {
        public: true,
        [Op.or]: [
          { codeShare: { [Op.like]: searchQuery } },
          { name: { [Op.iLike]: `%${searchQuery}%` } },
          { creator: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      },
      include: [
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: Exercise,
          through: { attributes: [] },
        },
        {
          model: SuperSet,
          through: { attributes: [] },
          include: [
            {
              model: Exercise,
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    let allExercises = 0;
    for (const routine of result) {
      const exercises = await routine.getExercises();
      allExercises += exercises.length;
      const superSets = await routine.getSuperSets();
      for (const superset of superSets) {
        const exercise = await superset.getExercises();
        allExercises += exercise.length;
      }
    }

    const resultWithExerciseCount = result.map((routine) => {
      return {
        ...routine.toJSON(),
        exerciseCount: allExercises,
      };
    });

    res.status(200).send(resultWithExerciseCount);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "An error occurred during search",
      details: error.message,
    });
  }
});

router.get("/filter", async (req, res) => {
  const muscleNames = req.query.muscles;

  if (!muscleNames) {
    return res.status(400).json({ message: "Muscle names are required" });
  }

  let muscles = [];

  if (typeof muscleNames === "string") {
    muscles = muscleNames.split(",");
  }

  try {
    const result = await Routine.findAll({
      where: {
        public: true,
      },
      attributes: ["id", "name", "selectDay", "creator"],
      include: {
        model: Tag,
        where: {
          tagName: {
            [Op.in]: muscles,
          },
        },
        through: { attributes: [] },
      },
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "An error occurred during search",
      details: error.message,
    });
  }
});

module.exports = router;
