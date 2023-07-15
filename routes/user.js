const Router = require("express");
const { User, Routine, Exercise, SuperSet, Tag } = require("../model");

const { generateToken, validateToken } = require("../config/token");
const { passwordValidator } = require("../middleware/passwordStrong");

const { Op } = require("sequelize");
const router = Router();

const userController = require("../controllers/userController");
const { route } = require("./search");

// REQUEST USER INFORMATION

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "salt"] },
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding all users",
      details: error.message,
    });
  }
});

// router.get("/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findOne({
//       where: { id: userId },
//       attributes: { exclude: ["password", "salt"] },
//     });

//     res.status(200).send(user);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem finding the user",
//       details: error.message,
//     });
//   }
// });
router.get("/:userId", userController.getUserById);

// router.get("/data/token", async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];

//     const decodedToken = validateToken(token);

//     const userId = decodedToken.user;

//     const user = await User.findByPk(userId.id);

//     if (!user.id) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     res.send({
//       id: user.id,
//       name: user.name,
//       lastName: user.lastName,
//       birthdate: user.birthdate,
//       country: user.country,
//       email: user.email,
//     });
//   } catch (error) {
//     res.status(401).send({ message: "Invalid token" });
//   }
// });
router.get("/data/token", userController.getDataToken);

// router.get("/routines/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     const routines = await user.getRoutines({
//       include: [
//         { model: User, through: { where: { UserId: userId } }, attributes: [] },
//         {
//           model: Tag,
//           through: { attributes: [] },
//         },
//       ],
//     });

//     res.status(200).send(routines);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem finding the user routines",
//       details: error.message,
//     });
//   }
// });
router.get("/routines/:userId", userController.getUserRoutines);

// router.get("/exercises/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const exercises = await Exercise.findAll({ where: { UserId: userId } });
//     if (!exercises) {
//       return res.status(404).send({ message: "exercises not found" });
//     }
//     res.status(200).send(exercises);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem finding the user exercises",
//       details: error.message,
//     });
//   }
// });
router.get("/exercises/:userId", userController.getUserExercises);

// router.get("/superSets/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const superSets = await SuperSet.findAll({
//       where: { UserId: userId },
//       include: [
//         {
//           model: Exercise,
//         },
//       ],
//     });
//     if (!superSets) {
//       return res.status(404).send({ message: "superSets not found" });
//     }
//     res.status(200).send(superSets);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem finding the user superset",
//       details: error.message,
//     });
//   }
// });
router.get("/superSets/:userId", userController.getUserSuperSets);

// router.patch("/editProfile/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const { country, birthdate, lastName, name, username } = req.body;

//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     await user.update({ country, birthdate, lastName, name, username });

//     res.status(200).send(user);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem updating the user information",
//       details: error.message,
//     });
//   }
// });
router.patch("/editProfile/:userId", userController.editUserProfile);
// VALIDATE EMAIL
router.post("/emailValidate", userController.validateEmail);
// router.post("/emailValidate", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ where: { email: email } });

//     if (user) {
//       return res.status(409).send({
//         message: "the email already exists",
//       });
//     }

//     res.status(200).send({
//       message: "Email is available for registration.",
//     });
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem checking the email",
//       details: error.message,
//     });
//   }
// });

// REGISTER
router.post("/register", userController.register);
// router.post("/register", passwordValidator, async (req, res) => {
//   const { name, lastName, birthdate, password, email, country, username } =
//     req.body;
//   try {
//     const newUser = await User.create({
//       name,
//       lastName,
//       birthdate,
//       password,
//       email,
//       country,
//       username,
//     });

//     const payload = {
//       id: newUser.id,
//       email: newUser.email,
//       username: newUser.username,
//     };

//     const token = generateToken(payload);

//     res.cookie("token", token);
//     res.status(201).send(token);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem creating the user",
//       details: error.message,
//     });
//   }
// });

//LOGIN
router.post("/login", userController.login);
// router.post("/login", async (req, res) => {
//   const { userLogin, password } = req.body;
//   try {
//     const user = await User.findOne({
//       where: { [Op.or]: [{ email: userLogin }, { username: userLogin }] },
//     });

//     if (!user) {
//       return res.status(401).send({
//         error: "Unauthorized",
//         message: "Invalid user",
//       });
//     }

//     const validate = await user.validatePassword(password);

//     if (!validate) {
//       return res.status(401).send({
//         error: "Unauthorized",
//         message: "Invalid password",
//       });
//     }

//     const payload = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//     };

//     const token = generateToken(payload);

//     res.cookie("token", token).send(token);
//   } catch (error) {
//     res.status(422).send({
//       error: "Unprocessable Entity",
//       message: "There was a problem login the user",
//       details: error.message,
//     });
//   }
// });

//LOGOUT

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
