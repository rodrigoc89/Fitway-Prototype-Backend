const Router = require("express");
const routineController = require("../controllers/routineController");

const router = Router();

// GET code of share routine
router.get("/shareRoutine/:codeShare", routineController.shareRoutine);

// GET routines by ID
router.get("/:routineId", routineController.getRoutineById);

router.get("/dataRoutine/:routineId", routineController.getDataRoutine);

// POST created new routine
router.post("/newRoutine/:userId", routineController.newRoutine);

// POST add routine
router.post("/addRoutine/:userId/:routineId", routineController.addRoutine);

// PATCH update routine
router.patch("/updateRoutine/:routineId", routineController.updateRoutine);

// DELETE deleted routine
router.delete(
  "/deleteRoutine/:userId/:routineId",
  routineController.deleteRoutine
);
// DELETE remove exercises of routine
router.delete(
  "/removeExercise/:routineId/:exerciseId",
  routineController.removeExercise
);

module.exports = router;
