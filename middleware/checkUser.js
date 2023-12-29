const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/config");
const { user } = require("../db/db");
const User = user;

exports.checkUser = async (req, res, next) => {
  let success = false;

  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Token not found.",
      });
    }

    token = token.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        status: 401,
        success,
        message: "Unauthorized Access",
      });
    }

    jwt.verify(token, jwtSecretKey, async (err, data) => {
      if (err) {
        return res.status(403).send({
          status: 403,
          success,
          message: "Forbidden Access.",
        });
      }

      let user = await User.findOne({
        where: {
          id: data.id,
        },
      });

      if (!user) {
        return res.status(403).send({
          status: 403,
          success,
          message: "Forbidden Access.",
        });
      }

      success = true;
      req.user = data;
      next();
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};
