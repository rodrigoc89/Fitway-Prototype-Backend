const Router = require("express");
const { Routine, Exercise, SuperSet, User } = require("../model");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const routines = await Routine.findAll();
    res.status(200).send(routines);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all routines",
      details: error.message,
    });
  }
});

router.get("/:routineId", async (req, res) => {
  const { routineId } = req.params;
  try {
    const routine = await Routine.findOne({ where: { id: routineId } });
    res.status(200).send(routine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the routine",
      details: error.message,
    });
  }
});

// CREATED NEW ROUTINE
router.post("/newRoutine/:userId", async (req, res) => {
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

router.put("/updateRoutine/:routineId", async (req, res) => {
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

router.delete("/deleteRoutine/:routineId", async (req, res) => {
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
