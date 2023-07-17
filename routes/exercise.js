const Router = require("express");
const { Exercise, User, Routine, SuperSet, Tag } = require("../model");
const exerciseController = require("../controllers/exerciseController");

const router = Router();

// GET exercise by ID
router.get("/:exerciseId", exerciseController.getExercise);

// POST new exercise
router.post(
  "/newExercise/:userId/:routineId/:supersetId?",
  exerciseController.newExercise
);

// POST add exercise
router.post(
  "/addExercise/:exerciseId/:routineId/:supersetId?",
  exerciseController.addExercise
);

// PATCH edit exercise
router.patch("/editExercise/:exerciseId", exerciseController.editExercise);

// PATCH re order exercise
router.patch("/reOrder", async (req, res) => {
  const { allExercises } = req.body;

  try {
    const exercisesToUpdate = [];
    const superSetsToUpdate = [];

    allExercises.forEach((exercise) => {
      if (exercise.type === "single") {
        exercisesToUpdate.push(exercise);
      } else if (exercise.type === "superset") {
        superSetsToUpdate.push(exercise);
      }
    });

    for (const exercise of exercisesToUpdate) {
      const { id, order } = exercise;

      await Exercise.update({ order: order }, { where: { id: id } });
    }

    for (const superSet of superSetsToUpdate) {
      const { id, order } = superSet;

      await SuperSet.update({ order: order }, { where: { id: id } });
    }

    res.status(200).json({ message: "update" });
  } catch (error) {
    res.status(422).json({
      error: "Unprocessable Entity",
      message: "There was a problem updating the exercises",
      details: error.message,
    });
  }
});

// DELETE deleted exercise
router.delete("/deleteExercise/:exerciseId", exerciseController.deleteExercise);

module.exports = router;
