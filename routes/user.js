const Router = require("express");
const { User, Routine, Exercise, SuperSet } = require("../model");

const { generateToken, validateToken } = require("../config/token");
const { validateAuth, validateAdmin } = require("../middleware/auth");
const { passwordValidator } = require("../middleware/passwordStrong");

const router = Router();

// REQUEST USER INFORMATION
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = validateToken(token);

    const userId = decodedToken.user;

    const user = await User.findByPk(userId.id);

    if (!user.id) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      id: user.id,
      fullName: user.fullName,
      birthday: user.birthday,
      email: user.email,
    });
  } catch (error) {
    res.status(401).send({ message: "Invalid token" });
  }
});

router.get("/routines/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password", "salt"] },
      include: [
        {
          model: Routine,
          include: [
            { model: Exercise },
            {
              model: SuperSet,
              include: {
                model: Exercise,
              },
            },
          ],
        },
      ],
    });
    if (!user.id) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem find user routine",
      details: error.message,
    });
  }
});

router.post("/editProfile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { weight } = req.body;
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    await user.update({ weight });
    res.status(200).send(user);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem updating user information",
      details: error.message,
    });
  }
});

// VALIDATE EMAIL
router.post("/emailValidate", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      return res.status(409).send({
        error: "Conflict",
        message: "the email already exists",
      });
    }

    res.status(200).send({
      message: "Email is available for registration.",
    });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem checking the email",
      details: error.message,
    });
  }
});

// REGISTER
router.post("/register", passwordValidator, async (req, res) => {
  const { name, lastName, birthdate, password, email, country } = req.body;
  try {
    const newUser = await User.create({
      name,
      lastName,
      birthdate,
      password,
      email,
      country,
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      lastName: newUser.lastName,
      password: newUser.password,
      birthdate: newUser.birthdate,
      email: newUser.email,
      country: newUser.country,
    };

    const token = generateToken(payload);

    res.cookie("token", token);
    res.status(201).send(token);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating the user",
      details: error.message,
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).send({
        error: "Unauthorized",
        message: "Invalid user",
      });
    }

    const validate = await user.validatePassword(password);

    if (!validate) {
      return res.status(401).send({
        error: "Unauthorized",
        message: "Invalid password",
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      birthdate: user.birthdate,
      password: user.password,
      email: user.email,
      country: user.country,
    };

    const token = generateToken(payload);

    res.cookie("token", token).send(token);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem login the user",
      details: error.message,
    });
  }
});

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
