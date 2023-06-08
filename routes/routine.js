const Router = require("express");
const { Routine, Exercise, SuperSet, User } = require("../model");

const router = Router();

// CREATED NEW ROUTINE
router.post("/:userId/newRoutine", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const { name, selectDay, description } = req.body;

    const newRoutine = await Routine.create({
      name,
      selectDay,
      description,
      UserId: userId,
    });

    await user.addRoutine(newRoutine);

    res.status(201).send(newRoutine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating Routine",
      details: error.message,
    });
  }
});

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

router.post("/:routineId/addExercise", async (req, res) => {
  const { routineId } = req.params;
  try {
    const routine = await Routine.findOne({ where: { id: routineId } });

    if (!routine) {
      return res.status(404).json({ message: "routine not found" });
    }
    const { exerciseId } = req.body;

    const exercise = await Exercise.findOne({ where: { id: exerciseId } });

    if (!exercise) {
      return res.status(404).json({ message: "exercise not found" });
    }

    await routine.addExercise(exercise);

    res.status(200).send(exercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding the Exercise",
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
