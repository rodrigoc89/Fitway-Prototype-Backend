const Router = require("express");
const { OAuth2Client } = require("google-auth-library");
const { User } = require("../model");
const { generateRandomPassword } = require("../config/auth");
require("dotenv").config();

const router = Router();

const audience = [
  process.env.ANDROID_GOOGLE_CLIENT_ID,
  process.env.EXPO_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
];

const client = new OAuth2Client(audience);

router.post("/google/auth", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: audience,
    });

    const payload = ticket.getPayload();

    const { given_name, family_name, email, name } = payload;

    let user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      const password = await generateRandomPassword();
      user = await User.create({
        name: given_name,
        lastName: family_name,
        birthdate: "2000-1-1",
        password: password,
        email: email,
        country: "none",
        username: name,
      });
      return res.status(201).json({ message: "Successfully registered user" });
    }

    res.status(200).json({ message: "login successful" });
  } catch (error) {
    console.error(error);

    if (error.name === "GoogleAuthError") {
      return res.status(401).json({ error: "Google authentication erro" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Google token expired" });
    }

    res.status(500).json({ error: "Failed to sign in with Google" });
  }
});

module.exports = router;
