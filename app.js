const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require("./routes/index");
const db = require("./db/index");
require("./model/index");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", router);

app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

db.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}`);
  });
});

module.exports = app;
