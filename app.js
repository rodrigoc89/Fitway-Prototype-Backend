const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require("./routes/index");
const db = require("./db/index");
require("./model/index");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", router);

db.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`escuchando en el puerto ${port}`);
  });
});

module.exports = app;
