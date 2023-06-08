const { Router } = require("express");
const { User, Routine, SuperSet, Exercise } = require("../model");

const router = Router();

router.post("/:routineId", async (req, res) => {
  const { routineId } = req.params;
  try {
    const newSuperset = await SuperSet.create({ RoutineId: routineId });

    res.status(201).send(newSuperset);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating Superset",
      details: error.message,
    });
  }
});

router.post("/newExercise/:supersetId", async (req, res) => {
  const { supersetId } = req.params;

  try {
    const superset = await SuperSet.findOne({ where: { id: supersetId } });

    const { name, reps, element, rest, muscle, series, description } = req.body;

    const newExercise = await Exercise.create({
      name,
      reps,
      element,
      rest,
      muscle,
      series,
      description,
      SuperSetId: superset.id,
    });

    await superset.addExercise(newExercise);

    res.status(201).send(newExercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating Exercise",
      details: error.message,
    });
  }
});

module.exports = router;
