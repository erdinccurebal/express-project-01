const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const jwt = require("jwt-simple");

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).send({ message: "Username or password invalid!" });
  }

  const usernameLength = String(username).length;
  const passwordLength = String(password).length;

  if (usernameLength > 18 || passwordLength > 20) {
    return res.status(401).send({ message: "Username or password invalid!" });
  }

  const userModel = await UserModel.findOne({ username: username });

  if (!userModel) {
    return res.status(401).send({ message: "Username or password invalid!" });
  }

  if (password != userModel.password) {
    return res.status(401).send({ message: "Username or password invalid!" });
  }

  const payload =
    userModel.username +
    "|_547-|" +
    userModel.password +
    "|_547-|" +
    userModel.role;
  const token = jwt.encode(payload, "4684654654894");
  res.status(200).send({ token });
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).send({ message: "Username or password invalid!" });
  }

  const usernameLength = String(username).length;
  const passwordLength = String(password).length;

  if (usernameLength > 18 || passwordLength > 20) {
    return res.status(401).send({ message: "Username or password invalid!" });
  }

  const userModelFindOne = await UserModel.findOne({ username: username });

  if (userModelFindOne) {
    return res.status(401).send({ message: "Username has database." });
  }

  const newUser = {
    username,
    password,
    role: "member",
    createdDate: Date.now(),
  };
  const userModel = new UserModel(newUser);

  userModel.save((error, result) => {
    if (error) {
      return res.status(500).send({ message: err });
    }
    const newResult = { message: "Registered user." };
    res.status(200).send(newResult);
  });
});

module.exports = router;
