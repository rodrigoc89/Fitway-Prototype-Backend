const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtConfig = {
  secret: process.env.SECRET,
  expiresIn: "2d",
};

const generateToken = (payload) => {
  const token = jwt.sign({ user: payload }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  return token;
};

const validateToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = { generateToken, validateToken };
