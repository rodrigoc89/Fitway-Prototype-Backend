const superSetRepository = require("../repositories/superSetRepository");
const userRepository = require("../repositories/userRepository");
const routineRepository = require("../repositories/routineRepository");
const { Exercise, Tag } = require("../model");
const { Op } = require("sequelize");

const getSuperSetById = async (superSetId) => {
  const superSet = await superSetRepository.findById(superSetId);
  if (!superSet) {
    throw new Error("super set not found");
  }

  return superSet;
};

const getExercises = async (superSetId) => {
  const superSet = await superSetRepository.findById(superSetId);
  if (!superSet) {
    throw new Error("super set not found");
  }
  const exercises = await superSet.getExercises();
  if (!exercises) {
    throw new Error("exercises not found");
  }
  superSetId;

  return exercises;
};

const createSuperset = async (routineId, userId, order, quantity) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  const routine = await routineRepository.findById(routineId);
  if (!routine) {
    throw new Error("routine not found");
  }

  const newSuperSet = await superSetRepository.create({
    order,
    quantity,
    UserId: user.id,
  });

  await routine.addSuperSet(newSuperSet);

  return newSuperSet;
};

const addSuperSet = async (superSetId, routineId) => {
  const superSet = await superSetRepository.findById(superSetId);

  if (!superSet) {
    throw new Error("super set not found");
  }

  const routine = await routineRepository.findById(routineId);
  if (!routine) {
    throw new Error("routine not found");
  }

  await routine.addSuperSet(superSet);

  return superSet;
};

const removeExercise = async (routineId, superSetId, exerciseId) => {
  const [routine, superSet, exercise] = await Promise.all([
    routineRepository.findById(routineId),
    superSetRepository.findById(superSetId),
    Exercise.findByPk(exerciseId),
  ]);

  if (!superSet) {
    throw new Error("super set not found");
  }

  if (!routine) {
    throw new Error("routine not found");
  }

  if (!exercise) {
    throw new Error("exercises not found");
  }
  await superSet.removeExercises(exercise);

  const muscle = exercise.muscle;

  const exerciseCountInRoutine = await routine.countExercises({
    where: {
      muscle: exercise.muscle,
    },
  });

  const superSets = await routine.getSuperSets({
    include: [
      {
        model: Exercise,
      },
    ],
  });

  let exerciseCountInSuperSets = 0;
  for (const superset of superSets) {
    const exercises = superset.Exercises;
    const filteredExercises = exercises.filter((e) => e.muscle === muscle);
    exerciseCountInSuperSets += filteredExercises.length;
  }

  const totalExerciseCount = exerciseCountInRoutine + exerciseCountInSuperSets;

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
};

const deleteSuperset = async (routineId, supersetId) => {
  const [routine, superSet] = await Promise.all([
    routineRepository.findById(routineId),
    superSetRepository.findById(supersetId),
  ]);

  if (!routine) {
    throw new Error("routine not found");
  }
  if (!superSet) {
    throw new Error("super set not found");
  }

  const exercisesInRoutine = await routine.getExercises();
  const exercisesInSuperset = await superSet.getExercises();
  const otherSupersets = await routine.getSuperSets({
    where: {
      id: {
        [Op.ne]: supersetId,
      },
    },
    include: [
      {
        model: Exercise,
      },
    ],
  });

  const exercisesInOtherSupersets = otherSupersets.flatMap(
    (superset) => superset.Exercises
  );

  const otherExercises = [...exercisesInRoutine, ...exercisesInOtherSupersets];

  const musclesInSupersetTarget = [
    ...new Set(exercisesInSuperset.map((exercise) => exercise.muscle)),
  ];

  for (const muscle of musclesInSupersetTarget) {
    const matchingExercises = otherExercises.filter((e) => e.muscle === muscle);
    if (matchingExercises.length === 0) {
      const tagToRemove = await Tag.findOne({
        where: {
          tagName: muscle,
        },
      });
      await routine.removeTag(tagToRemove);
    }
  }

  await superSetRepository.eliminate(supersetId);
};

module.exports = {
  getSuperSetById,
  getExercises,
  createSuperset,
  addSuperSet,
  removeExercise,
  deleteSuperset,
};
