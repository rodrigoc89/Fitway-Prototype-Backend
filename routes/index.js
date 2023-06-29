const Router = require("express");
const userRoutes = require("./user");
const routineRoutes = require("./routine");
const exerciseRoutes = require("./exercise");
const superSetRoutes = require("./superset");
const searchRoutes = require("./search");

const router = Router();

router.use("/users", userRoutes);
router.use("/routine", routineRoutes);
router.use("/exercise", exerciseRoutes);
router.use("/superset", superSetRoutes);
router.use("/search", searchRoutes);

module.exports = router;
