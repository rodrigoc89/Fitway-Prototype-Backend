const { Router } = require("express");
const { User, Routine, SuperSet, Exercise } = require("../model");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const superSets = await SuperSet.findAll();
    res.status(200).send(superSets);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all superSets",
      details: error.message,
    });
  }
});

router.get("/:supersetId", async (req, res) => {
  const { supersetId } = req.params;
  try {
    const superSet = await SuperSet.findByPk(supersetId);
    res.status(200).send(superSet);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the superset",
      details: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, parent, parentId } = req.body;

    const newSuperset = await SuperSet.create({
      UserId: userId,
    });

    if (parent == "Routine") {
      const routine = await Routine.findByPk(parentId);
      await routine.addSuperSet(newSuperset);
    }

    res.status(201).send(newSuperset);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating superset",
      details: error.message,
    });
  }
});

router.delete("/deleteSuperset/:supersetId", async (req, res) => {
  const { supersetId } = req.params;
  try {
    await Exercise.destroy({ where: { id: supersetId } });

    res.status(200).send({ message: "the superset has been removed" });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem deleting the superset",
      details: error.message,
    });
  }
});

module.exports = router;
