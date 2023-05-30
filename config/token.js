const jwt = require("jsonwebtoken");
const secret = require("../config/dotenv").SECRET;

const jwtConfig = {
  secret: process.env.SECRET || secret,
  expiresIn: "2d",
};

const generateToken = (payload) => {
  const token = jwt.sign({ user: payload }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
  console.log(token);
  return token;
};

const validateToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = { generateToken, validateToken };
