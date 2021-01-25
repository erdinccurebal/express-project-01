const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");

// Guards
const guardAdmin = require("../guards/admin");

// List user
router.post("/list", guardAdmin,  async (req, res) => {
  let userModel = await UserModel.find({}, "-__v");
  const newUserLists = userModel.map((data) => {
    const { _id: id, username, password, role, createdDate } = data;
    return {
      id,
      username,
      password,
      role,
      createdDate,
    };
  });
  res.json(newUserLists);
});

// One user
router.get("/one", guardAdmin ,async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(401).send({ message: "Bad Parameters" }); 
  }

  const userModel = await UserModel.findOne({ _id: id }).catch(() => {});
  
  if (!userModel) {
    return res.status(401).send({ message: "Not Found User." });
  }
  
  const { _id, username, password, role, createdDate } = userModel;
  const newUser = {id: _id, username, password, role, createdDate };
  res.json(newUser);
});


// Create user
router.post("/create", guardAdmin , async (req, res) => {
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
    const newResult = {
      id: result._id,
      username: result.username,
      password: result.password,
      role: result.role,
      createdDate: result.createdDate,
    };
    return res.status(200).send(newResult);
  });
});

// Update user
router.put("/update/:id", guardAdmin , async (req, res) => {
  const { id: _id } = req.params;
  if (!_id) {
    return res.status(401).send({ message: "Bad parameter!!!" });
  }
  const newUser = { ...req.body };
  if (!newUser) {
    return res.status(401).send({ message: "Bad parameter!!!" });
  }
  await UserModel.findByIdAndUpdate(_id, newUser)
    .then(() => {
      res.status(200).send({ message: "Update User" });
    })
    .catch((error) => {
      res.status(401).send({ message: "ERROR: " + error });
    });
});

// Delete posts
router.delete("/delete", guardAdmin , async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).send({ message: "Bad parameter !!!" });
  }
  const userModel = await UserModel.findOne({ _id: id }).catch(() => {});

  if (!userModel) {
    return res.status(404).send({ message: "Not found user." });
  }
  await userModel.deleteOne({ _id: id })
    .then(() => {
      res.status(200).send({ message: "Deleted User." });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
});

module.exports = router;
