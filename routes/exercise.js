const Router = require("express");
const { Exercise, User } = require("../model");

const router = Router();

router.post("/newExercise", async (req, res) => {
  try {
    const { name, reps, element, rest, muscle, series, description } = req.body;

    const newExercise = await Exercise.create({
      name,
      reps,
      element,
      rest,
      muscle,
      series,
      description,
    });

    res.status(201).send(newExercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating the Exercise",
      details: error.message,
    });
  }
});

router.put("/:exerciseId/editExercise", async (req, res) => {
  const { exerciseId } = req.params;
  try {
    const exercise = await Exercise.findOne({ where: { id: exerciseId } });

    if (!exercise) {
      return res.status(404).json({ message: "exercise not found" });
    }

    const { name, reps, element, rest, muscle, series, description } = req.body;

    await exercise.update({
      name,
      reps,
      element,
      rest,
      muscle,
      series,
      description,
    });

    res.status(200).send(exercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem updating the Exercise",
      details: error.message,
    });
  }
});

router.delete("/:exerciseId/deleteExercise", async (req, res) => {
  const { exerciseId } = req.params;
  try {
    await Exercise.destroy({ where: { id: exerciseId } });

    res.status(200).send({ message: "the exercise has been removed" });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem deleting the Exercise",
      details: error.message,
    });
  }
});

module.exports = router;
