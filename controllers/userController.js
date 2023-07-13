const authService = require("../services/authService");
const { passwordValidator } = require("../middleware/passwordStrong");

const register = async (req, res) => {
  const { name, lastName, birthdate, password, email, country, username } =
    req.body;
  try {
    passwordValidator(req, res, async () => {
      const token = await authService.register(
        name,
        lastName,
        birthdate,
        password,
        email,
        country,
        username
      );
      res.cookie("token", token);
      res.status(201).send(token);
    });
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem creating the user",
      details: error.message,
    });
  }
};

const login = async (req, res) => {
  const { userLogin, password } = req.body;
  try {
    const token = await authService.login(userLogin, password);
    res.cookie("token", token).send(token);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem logging in the user",
      details: error.message,
    });
  }
};

const validateEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const isEmailAvailable = await authService.validateEmail(email);

    if (!isEmailAvailable) {
      return res.status(409).send({
        message: "The email already exists",
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
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await authService.getUser(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the user",
      details: error.message,
    });
  }
};

const getDataToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userData = await authService.getData(token);
    res.send(userData);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "Invalid token",
      details: error.message,
    });
  }
};

const getUserRoutines = async (req, res) => {
  const { userId } = req.params;
  try {
    const routines = await authService.getRoutines(userId);
    res.status(200).send(routines);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the user routines",
      details: error.message,
    });
  }
};

const getUserExercises = async (req, res) => {
  const { userId } = req.params;
  try {
    const exercises = await authService.getExercises(userId);
    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the user exercises",
      details: error.message,
    });
  }
};

const editUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const { country, birthdate, lastName, name, username } = req.body;
    const user = await authService.editProfile(
      userId,
      country,
      birthdate,
      lastName,
      name,
      username
    );

    res.status(200).send(user);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem updating the user information",
      details: error.message,
    });
  }
};

const getUserSuperSets = async (req, res) => {
  const { userId } = req.params;
  try {
    const superSets = await authService.getSuperSets(userId);
    if (superSets === []) {
      return "no hay rutinas";
    }
    res.status(200).send(superSets);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the user superset",
      details: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  validateEmail,
  getUserById,
  getDataToken,
  getUserRoutines,
  getUserExercises,
  getUserSuperSets,
  editUserProfile,
};
