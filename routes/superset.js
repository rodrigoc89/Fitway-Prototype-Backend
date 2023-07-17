const { Router } = require("express");
const superSetController = require("../controllers/superSetControllers");

const router = Router();

// GET superset by ID
router.get("/:supersetId", superSetController.getSuperSet);

// GET exercises in superset
router.get("/getExercises/:supersetId", superSetController.getExercises);

// POST create new super set
router.post("/newSuperSet/:userId/:routineId", superSetController.newSuperSet);

// POST add super set
router.post(
  "/addSuperSet/:superSetId/:routineId",
  superSetController.addSuperSet
);

// DELETE remove exercise of routine
router.delete(
  "/removeExercise/:routineId/:superSetId/:exerciseId",
  superSetController.deletedExercise
);

// DELETE deleted super set
router.delete(
  "/deleteSuperset/:routineId/:supersetId",
  superSetController.deleteSuperset
);

module.exports = router;
