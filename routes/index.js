const Router = require("express");
const userRoutes = require("./user");
const routineRoutes = require("./routine");

const router = Router();

router.use("/users", userRoutes);
router.use("/routine", routineRoutes);

module.exports = router;
