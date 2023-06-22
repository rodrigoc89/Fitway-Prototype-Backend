const { Router } = require("express");
const { User, Routine, SuperSet, Exercise } = require("../model");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const superSets = await SuperSet.findAll();

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

  try {
    const superSet = await SuperSet.findByPk(supersetId);

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

router.post("/newSuperSet/:userId/:routineId", async (req, res) => {
  const { routineId, userId } = req.params;
  try {
    const { order, quantity } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const newSuperset = await SuperSet.create({
      UserId: userId,
      order,
      quantity,
    });

    const routine = await Routine.findByPk(routineId);

    if (!routine) {
      return res.status(404).json({ message: "routine not found" });
    }

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

router.delete("/removeExercise/:superSetId/:exerciseId", async (req, res) => {
  const { exerciseId, superSetId } = req.params;

  try {
    const superSet = await SuperSet.findByPk(superSetId);

    if (!superSet) {
      return res.status(404).json({ message: "exercise not found" });
    }

    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      return res.status(404).json({ message: "exercise not found" });
    }

    await superSet.removeExercise(exercise);

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
});

router.delete("/deleteSuperset/:supersetId", async (req, res) => {
  const { supersetId } = req.params;
  try {
    const superSet = await SuperSet.findByPk(supersetId);

    const exercises = await superSet.getExercises();

    if (exercises.length === 0) {
      return res.status(404).json({ message: "exercises not found" });
    }

    await superSet.removeExercises(exercises);
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
