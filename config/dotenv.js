require("dotenv").config({ path: "./.env" });

const requiredEnvs = ["SECRET,PORT"];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.warn(`Warning: Missing environment variable '${env}'`);
  }
});

module.exports = process.env;
