const routineService = require("../services/routineService");

const shareRoutine = async (req, res) => {
  const { codeShare } = req.params;
  try {
    const routine = routineService.share(codeShare);
    res.status(200).send(routine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the routine",
      details: error.message,
    });
  }
};

const getRoutineById = async (req, res) => {
  const { routineId } = req.params;
  try {
    const routine = await routineService.getRoutine(routineId);
    res.status(200).send(routine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the routine",
      details: error.message,
    });
  }
};

const getDataRoutine = async (req, res) => {
  const { routineId } = req.params;
  try {
    const dataRoutine = await routineService.getData(routineId);
    res.status(200).send(dataRoutine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the data of routine",
      details: error.message,
    });
  }
};

const newRoutine = async (req, res) => {
  const { userId } = req.params;
  try {
    const { name, selectDay, public } = req.body;
    const newRoutine = await routineService.createRoutine(
      userId,
      name,
      selectDay,
      public
    );
    res.status(201).send(newRoutine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating Routine",
      details: error.message,
    });
  }
};

const addRoutine = async (req, res) => {
  const { userId, routineId } = req.params;
  try {
    const addRoutine = await routineService.addRoutine(userId, routineId);
    res.status(200).send(addRoutine);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding the Routine",
      details: error.message,
    });
  }
};

const updateRoutine = async (req, res) => {
  const { routineId } = req.params;
  try {
    const { name, selectDay, public } = req.body;
    const update = await routineService.update(
      routineId,
      name,
      selectDay,
      public
    );
    res.status(200).send(update);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem updating the routine",
      details: error.message,
    });
  }
};

const deleteRoutine = async (req, res) => {
  const { routineId, userId } = req.params;
  try {
    await routineService.deleted(userId, routineId);
    res.status(200).json({
      message: "the routine has been removed",
    });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem deleting the routine",
      details: error.message,
    });
  }
};

const removeExercise = async (req, res) => {
  const { exerciseId, routineId } = req.params;
  try {
    await routineService.remove(exerciseId, routineId);
    res
      .status(200)
      .json({ message: "The exercise has been removed from the Routine" });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem deleting the exercise from the Routine",
      details: `${error.message} at ${error.stack.split("\n")[1]}`,
    });
  }
};

module.exports = {
  shareRoutine,
  getRoutineById,
  getDataRoutine,
  newRoutine,
  addRoutine,
  updateRoutine,
  deleteRoutine,
  removeExercise,
};
