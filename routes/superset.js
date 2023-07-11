const { Router } = require("express");
const { User, Routine, SuperSet, Exercise, Tag } = require("../model");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const superSets = await SuperSet.findAll({
      include: {
        model: Exercise,
        through: { attributes: [] },
      },
    });

    if (!superSets) {
      return res.status(404).json({ message: "super sets not found" });
    }

    res.status(200).send(superSets);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all super sets",
      details: error.message,
    });
  }
});

router.get("/:supersetId", async (req, res) => {
  const { supersetId } = req.params;
  console.log(supersetId);
  try {
    const superSet = await SuperSet.findByPk(supersetId, {
      include: {
        model: Exercise,
        through: { attributes: [] },
      },
    });

    if (!superSet) {
      return res.status(404).json({ message: "super set not found" });
    }

    res.status(200).send(superSet);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the super set",
      details: error.message,
    });
  }
});

router.get("/getExercises/:supersetId", async (req, res) => {
  const { supersetId } = req.params;
  try {
    const superSet = await SuperSet.findByPk(supersetId);
    const exercises = await superSet.getExercises();
    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding exercises into the super set",
      details: error.message,
    });
  }
});

router.post("/newSuperSet/:userId/:routineId", async (req, res) => {
  const { routineId, userId } = req.params;
  try {
    const { order, quantity } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const routine = await Routine.findByPk(routineId);

    if (!routine) {
      return res.status(404).json({ message: "routine not found" });
    }

    const newSuperset = await SuperSet.create({
      UserId: userId,
      order,
      quantity,
    });

    await routine.addSuperSet(newSuperset);

    res.status(201).send(newSuperset);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating super set",
      details: error.message,
    });
  }
});

router.post("/addSuperSet/:superSetId/:routineId", async (req, res) => {
  const { superSetId, routineId } = req.params;
  try {
    const superSet = await SuperSet.findByPk(superSetId);

    if (!superSet) {
      return res.status(404).json({ message: "super set not found" });
    }

    const routine = await Routine.findByPk(routineId);

    if (!routine) {
      return res.status(404).json({ message: "routine not found" });
    }

    await routine.addSuperSet(superSet);

    res.status(200).send(superSet);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding the super set",
      details: error.message,
    });
  }
});

router.delete(
  "/removeExercise/:routineId/:superSetId/:exerciseId",
  async (req, res) => {
    const { exerciseId, superSetId, routineId } = req.params;

    try {
      const [routine, superSet, exercise] = await Promise.all([
        Routine.findByPk(routineId),
        SuperSet.findByPk(superSetId),
        Exercise.findByPk(exerciseId),
      ]);

      if (!routine) {
        return res.status(404).json({ message: "routine not found" });
      }
      if (!superSet) {
        return res.status(404).json({ message: "superset not found" });
      }
      if (!exercise) {
        return res.status(404).json({ message: "exercise not found" });
      }

      await superSet.removeExercises(exercise);

      const exerciseCountInRoutine = await routine.countExercises({
        where: {
          muscle: exercise.muscle,
        },
      });

      const exerciseCountInSuperSets = await superSet.countExercises({
        where: {
          muscle: exercise.muscle,
        },
      });

      const totalExerciseCount =
        exerciseCountInRoutine + exerciseCountInSuperSets;

      if (totalExerciseCount === 0) {
        const tagToRemove = await Tag.findOne({
          where: {
            tagName: exercise.muscle,
          },
        });

        if (tagToRemove) {
          await routine.removeTag(tagToRemove);
        }
      }

      res
        .status(200)
        .send({ message: "The exercise has been removed from the super set" });
    } catch (error) {
      res.status(422).send({
        error: "Unprocessable Entity",
        message: "There was a problem deleting the exercise from the super set",
        details: error.message,
      });
    }
  }
);

router.delete("/deleteSuperset/:supersetId", async (req, res) => {
  const { supersetId } = req.params;
  try {
    const superSet = await SuperSet.findByPk(supersetId);

    const exercises = await superSet.getExercises();

    if (exercises.length !== 0) {
      await superSet.removeExercises(exercises);
    }

    await SuperSet.destroy({ where: { id: supersetId } });

    res.status(200).send({ message: "the super set has been removed" });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem removing the exercise of the super set",
      details: error.message,
    });
  }
});

module.exports = router;
