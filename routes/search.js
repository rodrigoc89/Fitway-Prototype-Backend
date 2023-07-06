const Router = require("express");
const { User, Routine, Exercise, SuperSet, Tag } = require("../model");
const { Op } = require("sequelize");

const router = Router();

router.get("/", async (req, res) => {
  const searchQuery = req.query.textSearch;
  try {
    
    if (!searchQuery) {
      const result = await Routine.findAll({
        where: {
          public: true,
        },
      });

      return res.status(200).send(result);
    }

    const result = await Routine.findAll({
      where: {
        public: true,
        [Op.or]: [
          { codeShare: { [Op.like]: searchQuery } },
          { name: { [Op.iLike]: searchQuery } },
          { creator: { [Op.iLike]: searchQuery } },
        ],
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
