const routineRepository = require("../repositories/routineRepository");
const userRepository = require("../repositories/userRepository");

const { Exercise, SuperSet, Tag, Routine, Log } = require("../model");

const getRoutine = async (routineId) => {
  const routine = await routineRepository.findById(routineId);

  if (!routine) {
    throw new Error("Routine not found");
  }

  return routine;
};

const getData = async (routineId) => {
  const dataRoutine = await routineRepository.getData(routineId);
  if (!dataRoutine) {
    throw new Error("Routine not found");
  }
  return dataRoutine;
};

const getLog = async (routineId) => {
  const log = await Routine.findByPk(routineId, {
    include: [
      {
        model: Log,
        through: { attributes: [] },
      },
    ],
  });

  if (!log) {
    throw new Error("log not found");
  }

  return log;
};

const createRoutine = async (userId, name, selectDay, public) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newRoutine = await routineRepository.create({
    name,
    selectDay,
    creator: user.username,
    public,
  });

  const shareCode = await newRoutine.generateShareCode(newRoutine.id);

  newRoutine.codeShare = shareCode;

  await newRoutine.save();
  await user.addRoutine(newRoutine);

  return newRoutine;
};

const createLog = async (userId, routineId, time, date) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  const routine = await routineRepository.findById(routineId);
  if (!routine) {
    throw new Error("Routine not found");
  }

  const muscles = routine.Tags.map((e) => e.tagName);

  const log = await user.createLog({
    time: time,
    muscles: muscles,
    day: routine.selectDay,
    date: date,
  });

  await routine.addLog(log);

  return log;
};

const addRoutine = async (userId, routineId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }
  const routine = await Routine.findByPk(routineId, {
    include: [{ model: Tag, through: { attributes: [] } }],
  });
  console.log(routine);
  if (!routine) {
    throw new Error("Routine not found");
  }
  await user.addRoutine(routine);

  return routine;
};

const update = async (routineId, name, selectDay, public) => {
  const routine = await routineRepository.findById(routineId);
  if (!routine) {
    throw new Error("Routine not found");
  }
  await routine.update({ name, selectDay, public });

  return routine;
};

const deleted = async (userId, routineId) => {
  const user = await userRepository.findById(userId);
  const routine = await routineRepository.findById(routineId);

  if (!user) {
    throw new Error("User not found");
  }
  if (!routine) {
    throw new Error("Routine not found");
  }

  if (user.username === routine.creator && !routine.public) {
    const exercises = await routine.getExercises();
    const superSets = await routine.getSuperSets();

    for (const superSet of superSets) {
      await superSet.removeExercises(exercises);
      await superSet.destroy();
    }

    await routine.removeExercises(exercises);
    await routine.removeSuperSets(superSets);
    await routineRepository.eliminate(routineId);
  } else {
    await user.removeRoutine(routine);
  }
};

const removeE = async (exerciseId, routineId) => {
  const routine = await routineRepository.findById(routineId);
  const exercise = await Exercise.findByPk(exerciseId);

  if (!routine) {
    throw new Error("Routine not found");
  }

  if (!exercise) {
    throw new Error("Routine not found");
  }

  await routine.removeExercises(exercise);

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
    const superSetId = superset.id;
    const superSet = await SuperSet.findByPk(superSetId, {
      include: { model: Exercise },
    });
    const exercises = superSet.Exercises;
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

module.exports = {
  getRoutine,
  getData,
  createRoutine,
  addRoutine,
  update,
  deleted,
  removeE,
  createLog,
  getLog,
};
