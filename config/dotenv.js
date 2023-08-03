require("dotenv").config({ path: "./.env" });

const requiredEnvs = [
  "SECRET",
  "PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_DIALECT",
  "GOOGLE_CLIENT_ID",
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.warn(`Warning: Missing environment variable '${env}'`);
  }
});

module.exports = process.env;
