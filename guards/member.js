const userModel = require("../models/user");
const jwt = require("jwt-simple");

module.exports = async (req, res, next) => {
  if (!req.header("authorization")) {
    return res
      .status(401)
      .send({ message: "Unauthorized, No authorization header." });
  }
  const token = req.header("authorization").split(" ")[1];

  try {
    const payload = jwt.decode(token, "4684654654894");

    let username = payload.split("|_547-|")[0];
    let password = payload.split("|_547-|")[1];
    let role = payload.split("|_547-|")[2];

    if (role != "member" && role != "admin" && role != "author") {
      return res
        .status(401)
        .send({ message: "You are not authorized to do this!" });
    }

    payloadControl = await userModel.findOne({ username: username });
    if (!payloadControl) {
      return res
        .status(401)
        .send({ message: "Unauthorized. Token is not valid!" });
    }
    if (payloadControl.username != username) {
      return res
        .status(401)
        .send({ message: "Unauthorized. Token is not valid!" });
    }
    if (payloadControl.password != password) {
      return res
        .status(401)
        .send({ message: "Unauthorized. Token is not valid!" });
    }
    if (!payload) {
      return res
        .status(401)
        .send({ message: "Unauthorized. Token is not valid!" });
    }
    next();
  } catch (error) {
    return res.status(401).send({ message: "Token unknown error occurred!!!" });
  }
};
