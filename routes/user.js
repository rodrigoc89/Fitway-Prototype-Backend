const Router = require("express");

const router = Router();

const userController = require("../controllers/userController");

// REQUEST USER INFORMATION

// GET user by ID
router.get("/:userId", userController.getUserById);

// GET data of token
router.get("/data/token", userController.getDataToken);

// GET routines created by user
router.get("/routines/:userId", userController.getUserRoutines);

// GET exercises created by user
router.get("/exercises/:userId", userController.getUserExercises);

// GET super sets created by user
router.get("/superSets/:userId", userController.getUserSuperSets);

// PATCH edit user profile
router.patch("/editProfile/:userId", userController.editUserProfile);

// POST validate email
router.post("/emailValidate", userController.validateEmail);

// POST register user
router.post("/register", userController.register);

//POST login user
router.post("/login", userController.login);

module.exports = router;
