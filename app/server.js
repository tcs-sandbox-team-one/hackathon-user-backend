require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const users = require("./routes/users");
app.use(express.json());

app.use(cors());
app.use("/user", users);

app.get("/", (req, res) => {
  res.status(200).send("User backend is running..");
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log("Listening on port ", port);
});
