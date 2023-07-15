const exerciseRepository = require("../repositories/exerciseRepository");
const routineRepository = require("../repositories/routineRepository");
const supersetRepository = require("../repositories/superSetRepository");
const userRepository = require("../repositories/userRepository");
const { Tag } = require("../model");

const getExerciseById = async (exerciseId) => {
  const exercise = await exerciseRepository.findById(exerciseId);
  if (!exercise) {
    throw new Error("exercises not found");
  }
  return exercise;
};

const createExercise = async (userId, routineId, supersetId, exerciseData) => {
  const [routine, user] = await Promise.all([
    await routineRepository.findById(routineId),
    await userRepository.findById(userId),
  ]);
  if (!user) {
    throw new Error("user not found");
  }
  if (!routine) {
    throw new Error("routine not found");
  }

  let superset;
  if (supersetId) {
    superset = await supersetRepository.findById(supersetId);
    if (!superset) {
      throw new Error(`Superset not found with ID ${supersetId}`);
    }
  }

  const {
    name,
    reps,
    element,
    rest,
    muscle,
    series,
    description,
    order,
    muscleImg,
    elementImg,
  } = exerciseData;

  const newExercise = await exerciseRepository.create({
    name,
    reps,
    element,
    rest,
    muscle,
    series,
    description,
    order,
    muscleImg,
    elementImg,
    UserId: userId,
  });

  let tag = await Tag.findOne({
    where: {
      tagName: muscle,
    },
  });

  if (!tag) {
    tag = await Tag.create({
      tagName: muscle,
    });
  }

  const tagExistsInRoutine = await routine.hasTag(tag);

  if (!tagExistsInRoutine) {
    await routine.addTag(tag);
  }

  if (superset) {
    await superset.addExercise(newExercise);
  } else {
    await routine.addExercise(newExercise);
  }

  return newExercise;
};

const addExercise = async (exerciseId, routineId, supersetId) => {
  const [routine, exercise] = await Promise.all([
    await routineRepository.findById(routineId),
    await exerciseRepository.findById(exerciseId),
  ]);
  if (!exercise) {
    throw new Error("exercise not found");
  }
  if (!routine) {
    throw new Error("routine not found");
  }

  let superset;
  if (supersetId) {
    superset = await supersetRepository.findById(supersetId);
    if (!superset) {
      throw new Error(`Superset not found with ID ${supersetId}`);
    }
  }

  const tag = await Tag.findOne({
    where: {
      tagName: exercise.muscle,
    },
  });

  const tagExistsInRoutine = await routine.hasTag(tag);

  if (!tagExistsInRoutine) {
    await routine.addTag(tag);
  }

  if (superset) {
    await superset.addExercise(exercise);
  } else {
    await routine.addExercise(exercise);
  }

  return exercise;
};

const updateExercise = async (exerciseId, exerciseData) => {
  const exercise = await exerciseRepository.findById(exerciseId);

  const {
    name,
    reps,
    element,
    rest,
    muscle,
    series,
    description,
    muscleImg,
    elementImg,
  } = exerciseData;

  await exercise.update({
    name,
    reps,
    element,
    rest,
    muscle,
    series,
    description,
    muscleImg,
    elementImg,
  });

  return exercise;
};

const destroyExcise = async (exerciseId) => {
  return await exerciseRepository.deleted(exerciseId);
};

module.exports = {
  getExerciseById,
  createExercise,
  addExercise,
  updateExercise,
  destroyExcise,
};
