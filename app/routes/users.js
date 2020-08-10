const express = require("express");
const router = express.Router();
const dbService = require("../services/dbService");

//create new user
router.post("/register", async (req, res) => {
  const user = req.body.userDetails;
  const result = await dbService.createUser(user);

  if (result !== null) {
    if (result !== -1)
      res.status(200).send({ message: "Created user successfully!!!" });
    else res.status(200).send({ error: "User already exists!!!" });
  } else res.status(200).send({ error: "Could not create user!!" });
});

//login
router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  const result = await dbService.authenticateUser(email, password);
  console.log(result);
  if (result.statusCode === 200) {
    res.status(200).send("Login success!!");
  } else if (result.statusCode === 500) {
    res.status(400).send("Wrong password!!");
  } else res.status(404).send("User does not exist!!");
});

router.post("/book", async (req, res) => {
  const user = await dbService.bookHospital(req.body.email);
  console.log("Booking success!", user);
  res.status(200).send({ message: "Booking success!", data: user });
});

module.exports = router;
