const Router = require("express");
const routineController = require("../controllers/routineController");

const router = Router();

// GET routines by ID
router.get("/:routineId", routineController.getRoutineById);

router.get("/dataRoutine/:routineId", routineController.getDataRoutine);

router.get("/log/:routineId", routineController.getLogRoutine);

// POST created new routine
router.post("/newRoutine/:userId", routineController.newRoutine);

// POST add routine
router.post("/addRoutine/:userId/:routineId", routineController.addRoutine);

router.post("/createLog/:userId/:routineId", routineController.createLog);

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
