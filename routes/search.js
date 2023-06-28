const Router = require("express");
const { User, Routine, Exercise, SuperSet } = require("../model");
const { Op } = require("sequelize");

const router = Router();

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
      attributes: ["id", "name", "selectDay", "creator"],
      include: {
        model: Exercise,
        where: {
          muscle: {
            [Op.in]: muscles,
          },
        },
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
