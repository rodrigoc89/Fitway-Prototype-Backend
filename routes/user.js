const Router = require("express");
const User = require("../model/User");

const { generateToken } = require("../config/token");
const { validateAuth, validateAdmin } = require("../middleware/auth");
const { passwordValidator } = require("../middleware/passwordStrong");

const router = Router();

router.post("/register", passwordValidator, async (req, res) => {
  const { name, lastName, password, email } = req.body;
  try {
    const newUser = await User.create({ name, lastName, password, email });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating the user",
      details: error.message,
    });
  }
});

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
      password: user.password,
      email: user.email,
    };

    const token = generateToken(payload);
    res.cookie("token", token).send(payload);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem login the user",
      details: error.message,
    });
  }
});

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
