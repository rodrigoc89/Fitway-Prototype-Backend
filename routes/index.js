const Router = require("express");
const userRoutes = require("./user");
const routineRoutes = require("./routine");
const exerciseRoutes = require("./exercise");

const router = Router();

router.use("/users", userRoutes);
router.use("/routine", routineRoutes);
router.use("/exercise", exerciseRoutes);

module.exports = router;
