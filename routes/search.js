const Router = require("express");
const { User, Routine, Exercise, SuperSet } = require("../model");
const { Op } = require("sequelize");

const router = Router();

router.get("/filter/:textSearch", async (req, res) => {
  const { textSearch } = req.params;
  try {
    const result = await Routine.findAll({
      attributes: ["id", "name", "selectDay"],
      include: {
        model: Exercise,
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${textSearch}%` } },
            { muscle: { [Op.like]: `%${textSearch}%` } },
          ],
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
