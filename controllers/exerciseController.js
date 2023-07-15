const exerciseService = require("../services/exerciseService");

const getExercise = async (req, res) => {
  const { exerciseId } = req.params;
  try {
    const exercise = await exerciseService.getExerciseById(exerciseId);
    res.status(200).send(exercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the exercise",
      details: error.message,
    });
  }
};

const newExercise = async (req, res) => {
  const { userId, routineId, supersetId } = req.params;
  try {
    const newExercise = await exerciseService.createExercise(
      userId,
      routineId,
      supersetId,
      req.body
    );
    return res.status(201).send(newExercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating the Exercise",
      details: `${error.message} at ${error.stack.split("\n")[1]}`,
    });
  }
};

const addExercise = async (req, res) => {
  const { exerciseId, routineId, supersetId } = req.params;
  try {
    const addExercise = await exerciseService.addExercise(
      exerciseId,
      routineId,
      supersetId
    );
    return res.status(201).send(addExercise);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding the Exercise",
      details: error.message,
    });
  }
};

const editExercise = async (req, res) => {
  const { exerciseId } = req.params;
  try {
    const exerciseUpdate = await exerciseService.updateExercise(
      exerciseId,
      req.body
    );
    res.status(200).send(exerciseUpdate);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem updating the Exercise",
      details: error.message,
    });
  }
};

const deleteExercise = async (req, res) => {
  const { exerciseId } = req.params;
  try {
    await exerciseService.destroyExcise(exerciseId);
    res.status(200).send({ message: "the exercise has been removed" });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem deleting the Exercise",
      details: error.message,
    });
  }
};
module.exports = {
  getExercise,
  newExercise,
  addExercise,
  editExercise,
  deleteExercise,
};
