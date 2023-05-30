const Router = require("express");
const { Routine, Exercise, SuperSet } = require("../model");

const router = Router();

router.post("/:routineId/newExercise", async (req, res) => {
  const { routineId } = req.params;
  try {
    const routine = await Routine.findOne({ where: { id: routineId } });

    if (!routine) {
      return res.status(404).json({ message: "routine not found" });
    }

    const { name, reps, element, rest, muscle, series, description } = req.body;

    const newExercise = await Exercise.create({
      name,
      reps,
      element,
      rest,
      muscle,
      series,
      description,
      RoutineId: routineId,
    });

    await routine.addExercise(newExercise);
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
