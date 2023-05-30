const Router = require("express");
const userRoutes = require("./user");

const router = Router();

router.use("/users", userRoutes);

module.exports = router;
