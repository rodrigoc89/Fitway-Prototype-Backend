const userService = require("../services/userService");

const register = async (req, res) => {
  try {
    const { name, lastName, birthdate, password, email, country, username } =
      req.body;

    const token = await userService.register(
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
    const token = await userService.login(userLogin, password);
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
  try {
    const { email } = req.body;
    const isEmailAvailable = await userService.validateEmail(email);

    if (isEmailAvailable) {
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
    const user = await userService.getUser(userId);
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
    const userData = await userService.getData(token);
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
    const routines = await userService.getRoutines(userId);
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
    const exercises = await userService.getExercises(userId);
    res.status(200).send(exercises);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the user exercises",
      details: error.message,
    });
  }
};

const getLogs = async (req, res) => {
  const { userId } = req.params;
  try {
    const logs = await userService.getAllLogs(userId);
    res.status(200).send(logs);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem finding the data of logs",
      details: error.message,
    });
  }
};

const editUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const { country, birthdate, lastName, name, username } = req.body;
    const user = await userService.editProfile(
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
    const superSets = await userService.getSuperSets(userId);
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

const info = async (req, res) => {
  const { userId } = req.params;
  try {
    const { genre, weight, heigh } = req.body;
    const user = await userService.addInfo(userId, genre, weight, heigh);
    res.status(200).send(user);
  } catch (error) {
    res.status(422).send({
      error: "Unprocessable Entity",
      message: "There was a problem adding info",
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
  getLogs,
  info,
};
