const Router = require("express");
const { Exercise, User, Routine, SuperSet } = require("../model");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.findAll();

    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all exercises",
      details: error.message,
    });
  }
});

router.get("/:ExerciseId", async (req, res) => {
  const { ExerciseId } = req.params;
  try {
    const exercises = await Exercise.findByPk(ExerciseId);

    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the exercise",
      details: error.message,
    });
  }
});

router.post("/newExercise", async (req, res) => {
  try {
    const {
      name,
      reps,
      element,
      rest,
      muscle,
      series,
      description,
      parent,
      parentId,
      userId,
      order,
    } = req.body;

    const exerciseData = {
      name,
      reps,
      element,
      rest,
      muscle,
      series,
      description,
      order,
    };
    const exercise = await Exercise.create({
      ...exerciseData,
      UserId: userId,
    });

    if (parent === "Routine") {
      const routine = await Routine.findOne({ where: { id: parentId } });

      await routine.addExercise(exercise);
    } else if (parent === "SuperSet") {
      const superset = await SuperSet.findOne({ where: { id: parentId } });

      await superset.addExercise(exercise);
    }
    return res.status(201).send(exercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating the Exercise",
      details: error.message,
    });
  }
});

router.post("/addExercise", async (req, res) => {
  try {
    const { parent, parentId, exerciseId } = req.body;

    const exercise = await Exercise.findOne({ where: { id: exerciseId } });

    if (!exercise) {
      return res.status(404).json({ message: "exercise not found" });
    }

    if (parent === "Routine") {
      const routine = await Routine.findOne({ where: { id: parentId } });

      await routine.addExercise(exercise);
    } else if (parent === "SuperSet") {
      const superset = await SuperSet.findOne({ where: { id: parentId } });

      await superset.addExercise(exercise);
    }

    res.status(200).send(exercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding the Exercise",
      details: error.message,
    });
  }
});

router.patch("/editExercise/:exerciseId", async (req, res) => {
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

router.delete("/deleteExercise/:exerciseId", async (req, res) => {
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
