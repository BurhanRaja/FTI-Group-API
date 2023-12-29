const express = require("express");
const db = require("./db/db");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Database Connection
db.sequelize.sync().then(() => {
  console.log("Database Connected.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  "/images",
  express.static(path.join(__dirname + "/public/images"), {
    maxAge: 31557600,
  })
);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Welcome to API.",
  });
});

app.use("/api/admin", require("./router/admin"));
app.use("/api/user", require("./router/user"));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
