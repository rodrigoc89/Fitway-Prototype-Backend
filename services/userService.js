const { generateToken, validateToken } = require("../config/token");

const userRepository = require("../repositories/userRepository");
const { User, Tag } = require("../model");

const login = async (userLogin, password) => {
  const user = await userRepository.findByEmailOrUsername(userLogin);

  if (!user) {
    throw new Error("Invalid user");
  }

  const validate = await user.validatePassword(password);

  if (!validate) {
    throw new Error("Invalid password");
  }

  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  const token = generateToken(payload);

  return token;
};

const register = async (
  name,
  lastName,
  birthdate,
  password,
  email,
  country,
  username
) => {
  const newUser = await userRepository.createUser(
    name,
    lastName,
    birthdate,
    password,
    email,
    country,
    username
  );

  const payload = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
  };

  const token = generateToken(payload);

  return token;
};

const validateEmail = async (email) => {
  const user = await userRepository.validateEmail(email);

  return user;
};

const getUser = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  return user;
};

const getData = async (token) => {
  const decodedToken = validateToken(token);
  const userId = decodedToken.user;
  const user = await userRepository.findById(userId.id);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    birthdate: user.birthdate,
    country: user.country,
    email: user.email,
    username: user.username,
  };
};

const getRoutines = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const routines = await user.getRoutines({
    include: [
      {
        model: Tag,
        through: { attributes: [] },
      },
    ],
  });

  return routines;
};

const getExercises = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const exercises = await userRepository.findExercises(userId);
  if (!user) {
    throw new Error("exercises not found");
  }
  return exercises;
};

const getSuperSets = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }
  const superSets = await userRepository.findSuperSets(userId);

  if (!superSets) {
    throw new Error("superSets not found");
  }
  return superSets;
};

const editProfile = async (
  userId,
  country,
  birthdate,
  lastName,
  name,
  username
) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  await user.update({ country, birthdate, lastName, name, username });
  return user;
};

module.exports = {
  login,
  register,
  getUser,
  validateEmail,
  getData,
  getRoutines,
  getExercises,
  getSuperSets,
  editProfile,
};
