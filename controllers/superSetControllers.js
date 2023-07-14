const superSetServices = require("../services/superSetService");

const getSuperSet = async (req, res) => {
  const { supersetId } = req.params;
  try {
    const superSet = await superSetServices.getSuperSetById(supersetId);
    res.status(200).send(superSet);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the super set",
      details: error.message,
    });
  }
};

const getExercises = async (req, res) => {
  const { supersetId } = req.params;
  try {
    const exercises = await superSetServices.getExercises(supersetId);
    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding exercises into the super set",
      details: error.message,
    });
  }
};

const newSuperSet = async (req, res) => {
  const { routineId, userId } = req.params;

  try {
    const { order, quantity } = req.body;

    const newSuperSet = await superSetServices.createSuperset(
      routineId,
      userId,
      order,
      quantity
    );

    res.status(201).send(newSuperSet);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating super set",
      details: error.message,
    });
  }
};

const addSuperSet = async (req, res) => {
  const { superSetId, routineId } = req.params;
  try {
    const superSet = await superSetServices(superSetId, routineId);
    res.status(200).send(superSet);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding the super set",
      details: error.message,
    });
  }
};

const deletedExercise = async (req, res) => {
  const { exerciseId, superSetId, routineId } = req.params;
  try {
    await superSetServices.removeExercise(exerciseId, superSetId, routineId);
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
};

const deleteSuperset = async (req, res) => {
  const { routineId, supersetId } = req.params;
  try {
    await superSetServices.deleteSuperset(routineId, supersetId);
    res.status(200).send({ message: "the super set has been removed" });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem removing the exercise of the super set",
      details: error.message,
    });
  }
};

module.exports = {
  getSuperSet,
  getExercises,
  newSuperSet,
  addSuperSet,
  deletedExercise,
  deleteSuperset,
};
