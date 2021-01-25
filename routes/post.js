const express = require("express");
const router = express.Router();
const PostModel = require("../models/post");

// Guards
const guardAdmin = require("../guards/admin");
const guardAuthor = require("../guards/author");
const guardMember = require("../guards/member");

// List all posts
router.get("/list",guardMember, async (req, res) => {
  const postModel = await PostModel.find({}, "-__v");

  const posts = postModel.map((data) => {
    const { _id, title, content, username, createdDate } = data;
    return {
      id: _id,
      title,
      content,
      username,
      createdDate,
    };
  });

  res.status(200).send(posts);
});

// Create post
router.post("/create",guardAuthor , (req, res) => {
  const { title, content, username } = req.body;

  const titleLenght = String(title).length > 50;
  const contentLenght = String(content).length > 300;

  if (!title || !content || !username || titleLenght || contentLenght) {
    return res.status(401).send({ message: "Bad Parameters" });
  }

  const newPost = { title, content, username, createdDate: Date.now() };

  let postModel = new PostModel(newPost);

  postModel.save((err, result) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    const { _id, title, content, username, createdDate } = result;
    const newResult = { id: _id, title, content, username, createdDate };
    return res.status(200).send(newResult);
  });
});

// Delete posts
router.delete("/delete",guardAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).send({ message: "Bad parameter !!!" });
  }
  const postModel = await PostModel.findOne({ _id: id }).catch(() => {});

  if (!postModel) {
    return res.status(404).send({ message: "Not found user." });
  }
  await PostModel.deleteOne({ _id: id })
    .then(() => {
      res.status(200).send({ message: "Deleted User." });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
});

// One post
router.get("/one",guardMember, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(401).send({ message: "Bad Parameters" });
  }

  const postModel = await PostModel.findOne({ _id: id }).catch(() => {});

  if (!postModel) {
    return res.status(404).send({ message: "Not Found Post." });
  }

  const { _id, title, content, username, createdDate } = postModel;
  const newData = { id: _id, title, content, username, createdDate };
  res.json(newData);
});

// Update post
router.put("/update/:id",guardAdmin, async (req, res) => {
  const { id: _id } = req.params;
  if (!_id) {
    return res.status(401).send({ message: "Bad parameter!!!" });
  }
  const newPost = { ...req.body };
  if (!newPost) {
    return res.status(401).send({ message: "Bad parameter!!!" });
  }
  await PostModel.findByIdAndUpdate(_id, newPost)
    .then(() => {
      res.status(200).send({ message: "Update Post" });
    })
    .catch((error) => {
      res.status(401).send({ message: "ERROR: " + error });
    });
});

module.exports = router;
