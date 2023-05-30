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

router.put("/:routineId/updateRoutine", async (req, res) => {
  const { routineId } = req.params;
  try {
    const routine = await Routine.findOne({ where: { id: routineId } });

    if (!routine) {
      return res.status(404).json({ message: "routine not found" });
    }

    const { name, selectDay, description } = req.body;

    await routine.update({ name, selectDay, description });
    res.status(200).send(routine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem updating the routine",
      details: error.message,
    });
  }
});

router.delete("/:routineId/deleteRoutine", async (req, res) => {
  const { routineId } = req.params;
  try {
    await Routine.destroy({ where: { id: routineId } });
    res.status(200).send({
      message: "the routine has been removed",
    });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem deleting the routine",
      details: error.message,
    });
  }
});

module.exports = router;
