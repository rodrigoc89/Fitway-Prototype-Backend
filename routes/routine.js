const Router = require("express");
const { Routine, Exercise, SuperSet, User, Tag } = require("../model");
const routineController = require("../controllers/routineController");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const routines = await Routine.findAll({
       where: { public: true },
      include: [
        {
          model: User,
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).send(routines);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all routines",
      details: error.message,
    });
  }
});

 router.get("/shareRoutine/?codeShare", async (req, res) => {
   const { codeShare } = req.params;
   try {
     const routines = await Routine.findOne({
       where: { public: true, codeShare: codeShare },
       include: [
         {
           model: Tag,
           through: { attributes: [] },
         },
       ],
     });
     res.status(200).send(routines);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem finding the routine",
       details: error.message,
     });
   }
 });
router.get("/shareRoutine/:codeShare", routineController.shareRoutine);

 router.get("/:routineId", async (req, res) => {
   const { routineId } = req.params;
   try {
     const routine = await Routine.findByPk(routineId, {
       include: [
         {
           model: Tag,
           through: { attributes: [] },
         },
       ],
     });

     if (!routine) {
       return res.status(404).json({ message: "Routine not found" });
     }

     res.status(200).send(routine);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem finding the routine",
       details: error.message,
     });
   }
 });
router.get("/:routineId", routineController.getRoutineById);

 router.get("/dataRoutine/:routineId", async (req, res) => {
   const { routineId } = req.params;
   try {
     const dataRoutine = await Routine.findByPk(routineId, {
       attributes: { exclude: ["UserId"] },
       include: [
         {
           model: Exercise,
           through: { attributes: [] },
         },
         {
           model: SuperSet,
           through: { attributes: [] },

           include: {
             model: Exercise,
             through: { attributes: [] },
           },
         },
         {
           model: Tag,
           through: { attributes: [] },
         },
       ],
     });

     const superSets = await dataRoutine.getSuperSets({
       include: [
         {
           model: Exercise,
         },
       ],
     });
     const x = dataRoutine.Exercises;
     let countExercises = 0;
     for (const superset of superSets) {
       const superSetId = superset.id;
       const superSet = await SuperSet.findByPk(superSetId, {
         include: { model: Exercise },
       });
       const exercises = superSet.Exercises;
       countExercises += exercises.length;
     }
     const exerciseCount = countExercises + x.length;

     if (!dataRoutine) {
       return res.status(404).json({ message: "Routine not found" });
     }

     const responseData = {
       ...dataRoutine.toJSON(),
       exerciseCount: exerciseCount,
     };

     res.status(200).send(responseData);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem finding the data of routine",
       details: error.message,
     });
   }
 });
router.get("/dataRoutine/:routineId", routineController.getDataRoutine);

 //CREATED NEW ROUTINE
 router.post("/newRoutine/:userId", async (req, res) => {
   const { userId } = req.params;
   try {
     const user = await User.findByPk(userId);

     if (!user) {
       return res.status(404).json({ message: "user not found" });
     }

     const { name, selectDay, public } = req.body;

     const newRoutine = await Routine.create({
       name,
       selectDay,
       creator: user.username,
       public,
     });

     const shareCode = await newRoutine.generateShareCode(newRoutine.id);

     newRoutine.codeShare = shareCode;

     await newRoutine.save(newRoutine.codeShare);
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

router.post("/newRoutine/:userId", routineController.newRoutine);

 router.post("/addRoutine/:userId/:routineId", async (req, res) => {
   const { userId, routineId } = req.params;
   try {
     const user = await User.findByPk(userId);
     if (!user) {
       return res.status(404).json({ message: "user not found" });
     }

     const routine = await Routine.findByPk(routineId);
     if (!routine) {
       return res.status(404).json({ message: "routine not found" });
     }

     await user.addRoutine(routine);

     res.status(200).send(routine);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem adding the Routine",
       details: error.message,
     });
   }
 });

router.post("/addRoutine/:userId/:routineId", routineController.addRoutine);

 router.patch("/updateRoutine/:routineId", async (req, res) => {
   const { routineId } = req.params;
   try {
     const routine = await Routine.findByPk(routineId);

     if (!routine) {
       return res.status(404).json({ message: "routine not found" });
     }

     const { name, selectDay } = req.body;

     await routine.update({ name, selectDay });
     res.status(200).send(routine);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem updating the routine",
       details: error.message,
     });
   }
 });

router.patch("/updateRoutine/:routineId", routineController.updateRoutine);

 router.delete("/deleteRoutine/:userId/:routineId", async (req, res) => {
   const { routineId, userId } = req.params;
   try {
     const routine = await Routine.findByPk(routineId);

     const user = await User.findByPk(userId);

     if (!user) {
       return res.status(404).json({ message: "user not found" });
     }

     const exercises = await routine.getExercises();
     const superSets = await routine.getSuperSets();

     for (const superSet of superSets) {
       await superSet.removeExercises(exercises);
       await superSet.destroy();
     }

     await routine.removeExercises(exercises);
     await routine.removeSuperSets(superSets);

     if (!routine.public) {
       await Routine.destroy({ where: { id: routineId } });
     }
     await routine.removeUser(user);

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
 });

router.delete(
  "/deleteRoutine/:userId/:routineId",
  routineController.deleteRoutine
);

 router.delete("/removeExercise/:routineId/:exerciseId", async (req, res) => {
   const { exerciseId, routineId } = req.params;

   try {
     const routine = await Routine.findByPk(routineId);

     if (!routine) {
       return res.status(404).json({ message: "routine not found" });
     }

     const exercise = await Exercise.findByPk(exerciseId);

     if (!exercise) {
       return res.status(404).json({ message: "exercise not found" });
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
       .json({ message: "The exercise has been removed from the Routine" });
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem deleting the exercise from the Routine",
       details: `${error.message} at ${error.stack.split("\n")[1]}`,
     });
   }
 });

router.delete(
  "/removeExercise/:routineId/:exerciseId",
  routineController.removeExercise
);
module.exports = router;
