const Router = require("express");
const userRoutes = require("./user");
const routineRoutes = require("./routine");
const exerciseRoutes = require("./exercise");
const SuperSetRoutes = require("./superset");

const router = Router();

router.use("/users", userRoutes);
router.use("/routine", routineRoutes);
router.use("/exercise", exerciseRoutes);
router.use("/superset", SuperSetRoutes);

module.exports = router;
