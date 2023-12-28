const { user } = require("../db/db");
const User = user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/config");

exports.userLogin = async (req, res) => {
  let success = false;
  try {
    const { email, password } = req.body;

    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        success,
        message: "User not found",
      });
    }

    let checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Incorrect Password.",
      });
    }

    let token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        teamid: user.teamid,
        roleid: user.roleid,
      },
      jwtSecretKey
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      token,
    });
  } catch (err) {
    return res.status(200).send({
      status: 200,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.editUser = async (req, res) => {
  let success = false;

  try {
    const { name, email } = req.body;

    let user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (email !== user.email) {
      let user = await User.findOne({
        where: {
          email,
        },
      });
      if (user) {
        return res.status(400).send({
          status: 400,
          success,
          message: `Email is already in use.`,
        });
      }
    }

    await User.update(
      {
        email,
        name,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "User Editted successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.changePassword = async (req, res) => {
  let success = false;

  try {
    const { oldPassword, newPassword } = req.body;

    let user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        success,
        message: "User not found.",
      });
    }

    let passwordCheck = await bcrypt.compare(oldPassword, user.password);

    if (!passwordCheck) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Old Password not matching.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    await User.update(
      {
        password,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Password Changed successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.forgetPassword = async (req, res) => {
  let success = false;
  try {
  } catch (err) {}
};

exports.verifyForgetPasswordEmail = async (req, res) => {};

exports.resetPassword = async (req, res) => {};
