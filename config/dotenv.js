require("dotenv").config({ path: "./.env" });

const requiredEnvs = ["SECRET"];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.warn(`Warning: Missing environment variable '${env}'`);
  }
});

module.exports = process.env;
