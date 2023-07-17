const { Router } = require("express");
const { User, Routine, SuperSet, Exercise, Tag } = require("../model");
const { Op, where } = require("sequelize");
const superSetController = require("../controllers/superSetControllers");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const superSets = await SuperSet.findAll({
      include: {
        model: Exercise,
        through: { attributes: [] },
      },
    });

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

// router.get("/:supersetId", async (req, res) => {
//   const { supersetId } = req.params;
//   try {
//     const superSet = await SuperSet.findByPk(supersetId, {
//       include: {
//         model: Exercise,
//         through: { attributes: [] },
//       },
//     });

//     if (!superSet) {
//       return res.status(404).json({ message: "super set not found" });
//     }

//     res.status(200).send(superSet);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem finding the super set",
//       details: error.message,
//     });
//   }
// });

router.get("/:supersetId", superSetController.getSuperSet);

// router.get("/getExercises/:supersetId", async (req, res) => {
//   const { supersetId } = req.params;
//   try {
//     const superSet = await SuperSet.findByPk(supersetId);
//     const exercises = await superSet.getExercises();
//     res.status(200).send(exercises);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem finding exercises into the super set",
//       details: error.message,
//     });
//   }
// });

router.get("/getExercises/:supersetId", superSetController.getExercises);

// router.post("/newSuperSet/:userId/:routineId", async (req, res) => {
//   const { routineId, userId } = req.params;
//   try {
//     const { order, quantity } = req.body;

//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     const routine = await Routine.findByPk(routineId);

//     if (!routine) {
//       return res.status(404).json({ message: "routine not found" });
//     }

//     const newSuperset = await SuperSet.create({
//       UserId: userId,
//       order,
//       quantity,
//     });

//     await routine.addSuperSet(newSuperset);

//     res.status(201).send(newSuperset);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem creating super set",
//       details: error.message,
//     });
//   }
// });

router.post("/newSuperSet/:userId/:routineId", superSetController.newSuperSet);

// router.post("/addSuperSet/:superSetId/:routineId", async (req, res) => {
//   const { superSetId, routineId } = req.params;
//   try {
//     const superSet = await SuperSet.findByPk(superSetId);

//     if (!superSet) {
//       return res.status(404).json({ message: "super set not found" });
//     }

//     const routine = await Routine.findByPk(routineId);

//     if (!routine) {
//       return res.status(404).json({ message: "routine not found" });
//     }

//     await routine.addSuperSet(superSet);

//     res.status(200).send(superSet);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem adding the super set",
//       details: error.message,
//     });
//   }
// });
router.post(
  "/addSuperSet/:superSetId/:routineId",
  superSetController.addSuperSet
);

// router.delete(
//   "/removeExercise/:routineId/:superSetId/:exerciseId",
//   async (req, res) => {
//     const { exerciseId, superSetId, routineId } = req.params;

//     try {
//       const [routine, superSet, exercise] = await Promise.all([
//         Routine.findByPk(routineId),
//         SuperSet.findByPk(superSetId),
//         Exercise.findByPk(exerciseId),
//       ]);

//       if (!routine) {
//         return res.status(404).json({ message: "routine not found" });
//       }
//       if (!superSet) {
//         return res.status(404).json({ message: "superset not found" });
//       }
//       if (!exercise) {
//         return res.status(404).json({ message: "exercise not found" });
//       }

//       await superSet.removeExercises(exercise);

//       const muscle = exercise.muscle;

//       const exerciseCountInRoutine = await routine.countExercises({
//         where: {
//           muscle: exercise.muscle,
//         },
//       });

//       const superSets = await routine.getSuperSets({
//         include: [
//           {
//             model: Exercise,
//           },
//         ],
//       });

//       let exerciseCountInSuperSets = 0;
//       for (const superset of superSets) {
//         const exercises = superset.Exercises;
//         const filteredExercises = exercises.filter((e) => e.muscle === muscle);
//         exerciseCountInSuperSets += filteredExercises.length;
//       }

//       const totalExerciseCount =
//         exerciseCountInRoutine + exerciseCountInSuperSets;

//       if (totalExerciseCount === 0) {
//         const tagToRemove = await Tag.findOne({
//           where: {
//             tagName: exercise.muscle,
//           },
//         });

//         if (tagToRemove) {
//           await routine.removeTag(tagToRemove);
//         }
//       }

//       res
//         .status(200)
//         .send({ message: "The exercise has been removed from the super set" });
//     } catch (error) {
//       res.status(422).send({
//         error: "Unprocessable Entity",
//         message: "There was a problem deleting the exercise from the super set",
//         details: error.message,
//       });
//     }
//   }
// );

router.delete(
  "/removeExercise/:routineId/:superSetId/:exerciseId",
  superSetController.deletedExercise
);

// router.delete("/deleteSuperset/:routineId/:supersetId", async (req, res) => {
//   const { routineId, supersetId } = req.params;
//   try {
//     const routine = await Routine.findByPk(routineId);
//     const superSet = await SuperSet.findByPk(supersetId);

//     if (!routine) {
//       return res.status(404).json({ message: "routine not found" });
//     }
//     if (!superSet) {
//       return res.status(404).json({ message: "superSet not found" });
//     }

//     const exercisesInRoutine = await routine.getExercises();
//     const exercisesInSuperset = await superSet.getExercises();
//     const otherSupersets = await routine.getSuperSets({
//       where: {
//         id: {
//           [Op.ne]: supersetId,
//         },
//       },
//       include: [
//         {
//           model: Exercise,
//         },
//       ],
//     });

//     const exercisesInOtherSupersets = otherSupersets.flatMap(
//       (superset) => superset.Exercises
//     );

//     const otherExercises = [
//       ...exercisesInRoutine,
//       ...exercisesInOtherSupersets,
//     ];

//     const musclesInSupersetTarget = [
//       ...new Set(exercisesInSuperset.map((exercise) => exercise.muscle)),
//     ];

//     for (const muscle of musclesInSupersetTarget) {
//       const matchingExercises = otherExercises.filter(
//         (e) => e.muscle === muscle
//       );
//       if (matchingExercises.length === 0) {
//         const tagToRemove = await Tag.findOne({
//           where: {
//             tagName: muscle,
//           },
//         });
//         await routine.removeTag(tagToRemove);
//       }
//     }

//     await SuperSet.destroy({ where: { id: supersetId } });

//     res.status(200).send({ message: "the super set has been removed" });
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem removing the exercise of the super set",
//       details: error.message,
//     });
//   }
// });

router.delete(
  "/deleteSuperset/:routineId/:supersetId",
  superSetController.deleteSuperset
);

module.exports = router;
