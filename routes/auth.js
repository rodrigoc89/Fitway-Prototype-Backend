const Router = require("express");
const { OAuth2Client } = require("google-auth-library");
const { User } = require("../model");
const { generateRandomPassword } = require("../config/auth");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google/auth", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { name, lastName, birthdate, email, country, username } = payload;

    let user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      const password = await generateRandomPassword();
      user = await User.create({
        name,
        lastName,
        birthdate,
        password,
        email,
        country,
        username,
      });
      return res.status(201).json({ message: "Successfully registered user" });
    }

    res.status(200).json({ message: "login successful" });
  } catch (error) {
    console.error(error);

    // Manejo de errores específicos (opcional)
    if (error.name === "GoogleAuthError") {
      return res.status(401).json({ error: "Google authentication erro" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Google token expired" });
    }

    res.status(500).json({ error: "Failed to sign in with Google" });
  }
});

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Aquí puedes implementar la lógica para actualizar el token de acceso utilizando el refreshToken
    // El refreshToken es proporcionado por Google y se usa para obtener un nuevo token de acceso cuando el actual expira

    // Ejemplo:
    // const newAccessToken = await tuFuncionParaActualizarAccessToken(refreshToken);

    res.status(200).json({ accessToken: "NUEVO_ACCESS_TOKEN" }); // Devuelve el nuevo token de acceso actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el token" });
  }
});

const router = Router();
