const Router = require("express");
const { Exercise, User, Routine, SuperSet, Tag } = require("../model");
const { Op } = require("sequelize");
const exerciseController = require("../controllers/exerciseController");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.findAll();

    if (!exercises) {
      return res.status(404).json({ message: "exercises not found" });
    }

    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all exercises",
      details: error.message,
    });
  }
});

 router.get("/:ExerciseId", async (req, res) => {
   const { ExerciseId } = req.params;
   try {
     const exercises = await Exercise.findByPk(ExerciseId);

     if (!exercises) {
       return res.status(404).json({ message: "exercises not found" });
     }

     res.status(200).send(exercises);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem finding the exercise",
       details: error.message,
     });
   }
 });

router.get("/:exerciseId", exerciseController.getExercise);

 router.post(
   "/newExercise/:userId/:routineId/:supersetId?",
   async (req, res) => {
     const { userId, routineId, supersetId } = req.params;

     try {
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
       } = req.body;

       const user = await User.findByPk(userId);

       if (!user) {
         return res.status(404).json({ message: "User not found" });
       }

       const routine = await Routine.findByPk(routineId);

       if (!routine) {
         return res
           .status(404)
           .json({ message: `Routine not found with ID ${routineId}` });
       }

       let superset;
       if (supersetId) {
         superset = await SuperSet.findByPk(supersetId);

         if (!superset) {
           return res
             .status(404)
             .json({ message: `Superset not found with ID ${supersetId}` });
         }
       }

       const exercise = await Exercise.create({
         name,
         reps,
         element,
         rest,
         muscle,
         series,
         description,
         muscleImg,
         elementImg,
         order,
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
         await superset.addExercise(exercise);
       } else {
         await routine.addExercise(exercise);
       }

       return res.status(201).send(exercise);
     } catch (error) {
       res.status(422).send({
         error: "Unprocessable Entity",
         message: "There was a problem creating the Exercise",
         details: `${error.message} at ${error.stack.split("\n")[1]}`,
       });
     }
   }
 );

router.post(
  "/newExercise/:userId/:routineId/:supersetId?",
  exerciseController.newExercise
);

 router.post(
   "/addExercise/:exerciseId/:routineId/:supersetId?",
   async (req, res) => {
     const { exerciseId, routineId, supersetId } = req.params;
     try {
       const exercise = await Exercise.findByPk(exerciseId);

       if (!exercise) {
         return res.status(404).json({ message: "exercise not found" });
       }

       const routine = await Routine.findByPk(routineId);

       if (!routine) {
         return res
           .status(404)
           .json({ message: `Routine not found with ID ${routineId}` });
       }

       let superset;
       if (supersetId) {
         superset = await SuperSet.findByPk(supersetId);

         if (!superset) {
           return res
             .status(404)
             .json({ message: `Superset not found with ID ${supersetId}` });
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

       return res.status(201).send(exercise);
     } catch (error) {
       res.status(422).send({
         error: "Unprocessable Entity",
         message: "There was a problem adding the Exercise",
         details: error.message,
       });
     }
   }
 );

router.post(
  "/addExercise/:exerciseId/:routineId/:supersetId?",
  exerciseController.addExercise
);

 router.patch("/editExercise/:exerciseId", async (req, res) => {
   const { exerciseId } = req.params;
   try {
     const exercise = await Exercise.findByPk(exerciseId);

     if (!exercise) {
       return res.status(404).json({ message: "exercise not found" });
     }

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
     } = req.body;

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

     res.status(200).send(exercise);
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem updating the Exercise",
       details: error.message,
     });
   }
 });

router.patch("/editExercise/:exerciseId", exerciseController.editExercise);

router.patch("/reOrder", async (req, res) => {
  const { allExercises } = req.body;

  try {
    const exercisesToUpdate = [];
    const superSetsToUpdate = [];

    allExercises.forEach((exercise) => {
      if (exercise.type === "single") {
        exercisesToUpdate.push(exercise);
      } else if (exercise.type === "superset") {
        superSetsToUpdate.push(exercise);
      }
    });

    for (const exercise of exercisesToUpdate) {
      const { id, order } = exercise;

      await Exercise.update({ order: order }, { where: { id: id } });
    }

    for (const superSet of superSetsToUpdate) {
      const { id, order } = superSet;

      await SuperSet.update({ order: order }, { where: { id: id } });
    }

    res.status(200).json({ message: "update" });
  } catch (error) {
    res.status(422).json({
      error: "Unprocessable Entity",
      message: "There was a problem updating the exercises",
      details: error.message,
    });
  }
});

 router.delete("/deleteExercise/:exerciseId", async (req, res) => {
   const { exerciseId } = req.params;
   try {
     await Exercise.destroy({ where: { id: exerciseId } });

     res.status(200).send({ message: "the exercise has been removed" });
   } catch (error) {
     res.status(422).send({
       error: "Unprocessable Entity",
       message: "There was a problem deleting the Exercise",
       details: error.message,
     });
   }
 });

router.delete("/deleteExercise/:exerciseId", exerciseController.deleteExercise);

module.exports = router;
