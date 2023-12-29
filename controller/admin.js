const { user, role, team, permission } = require("../db/db");
const User = user;
const Role = role;
const Team = team;
const Permission = permission;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/config");
const { Op } = require("sequelize");

// ----------------------------- Admin Auth ---------------------------------
exports.adminLogin = async (req, res) => {
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
        message: "User not found.",
      });
    }

    console.log(user.is_admin);

    if (user.is_admin != 2) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Not an Admin.",
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

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecretKey);

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

// -------------------------------- User ------------------------------------
exports.createUser = async (req, res) => {
  let success = false;

  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).send({
        status: 400,
        success,
        message: "User already Exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: securePassword,
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.editUser = async (req, res) => {
  let success = false;

  try {
    const { name, email } = req.body;
    const { id } = req.params;

    let user = await User.findOne({
      where: {
        id: id,
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
          id: id,
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

exports.getAllUser = async (req, res) => {
  let success = false;

  try {
    const allUsers = await User.findAll({
      where: {
        is_admin: {
          [Op.or]: [null, 0],
        },
      },
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: allUsers,
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

// ----------------------------------- Team ----------------------------------
exports.createTeam = async (req, res) => {
  let success = false;

  try {
    let { name } = req.body;

    let team = await Team.findOne({
      where: {
        name,
        adminid: req.admin.id,
      },
    });

    if (team) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Team with this name already Exists",
      });
    }

    await Team.create({
      name,
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Team created successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.editTeam = async (req, res) => {
  let success = false;

  try {
    const { id } = req.params;
    const { name } = req.body;

    let team = await Team.findOne({
      where: {
        id,
        adminid: req.admin.id,
      },
    });

    if (!team) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Team not found.",
      });
    }

    await Team.update(
      {
        name,
      },
      {
        where: {
          id,
          adminid: req.admin.id,
        },
      }
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Team Updated successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.deleteTeam = async (req, res) => {
  let success = false;

  try {
    const { id } = req.params;

    let team = await Team.findOne({
      where: {
        id,
      },
    });

    if (!team) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Team not found.",
      });
    }

    await User.update(
      {
        teamid: null,
      },
      {
        where: {
          teamid: id,
        },
      }
    );

    await Team.destroy({
      where: {
        id,
      },
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Team Deleted.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.getAllTeam = async (req, res) => {
  let success = false;
  try {
    let allTeams = await Team.findAll({});

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: allTeams,
    });
  } catch (err) {
    return res.status(200).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.getSingleTeam = async (req, res) => {
  let success = false;
  try {
    const { id } = req.params;

    let singleTeam = await Team.findOne({
      where: {
        id,
      },
      raw: true,
    });

    if (!singleTeam) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Team not found",
      });
    }

    let teamMembers = await User.findAll({
      where: {
        teamid: id,
      },
      raw: true,
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: { ...singleTeam, teamMembers },
    });
  } catch (err) {
    return res.status(200).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.addUserToTeam = async (req, res) => {
  let success = false;

  try {
    const { teamId, userId, roleId } = req.body;

    let team = await Team.findOne({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Team not found",
      });
    }

    let user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        success,
        message: "User not found",
      });
    }

    await User.update(
      {
        roleid: roleId,
        teamid: teamId,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Team assigned successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.removeTeamMember = async (req, res) => {
  let success = false;

  try {
    const { userId } = req.params;

    let user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        success,
        message: "User not found",
      });
    }

    await User.update(
      {
        teamid: null,
        roleid: null,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "User removed from Team.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

// ------------------------------- Roles -----------------------------------------
exports.createRole = async (req, res) => {
  let success = false;
  try {
    const { name, permissions } = req.body;

    let role = await Role.findOne({
      where: {
        name,
      },
    });

    if (role) {
      return res.status(400).send({
        status: 400,
        success,
        message: "Role already exists.",
      });
    }

    role = await Role.create({
      name,
    });

    for (const per of permissions) {
      await Permission.create({
        name: per,
        roleid: role.id,
        status: 1,
      });
    }

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Role created successfully.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.getAllRoles = async (req, res) => {
  let success = false;

  try {
    let allRoles = await Role.findAll({});

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: allRoles,
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.getSingleRole = async (req, res) => {
  let success = false;

  try {
    const { roleId } = req.params;
    let role = await Role.findOne({
      where: {
        id: roleId,
      },
      raw: true,
    });

    let allPermissions = await Permission.findAll({
      where: {
        roleid: role.id,
      },
      raw: true,
    });

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      data: { ...role, permissions: allPermissions },
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.assignRoleToUser = async (req, res) => {
  let success = false;

  try {
    const { roleId, userId } = req.body;

    let role = await Role.findOne({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Role not found.",
      });
    }

    let user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send({
        status: 404,
        success,
        message: "User not found",
      });
    }

    await User.update(
      {
        roleid: roleId,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Role assigned to User.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};

exports.updateRoleAndPermission = async (req, res) => {
  let success = false;

  try {
    const { permissions, name } = req.body;
    const { roleId } = req.params;

    let role = await Role.findOne({
      where: {
        id: roleId,
      },
    });

    if (!role) {
      return res.status(404).send({
        status: 404,
        success,
        message: "Role not found.",
      });
    }

    await Role.update(
      {
        name,
      },
      {
        where: {
          id: roleId,
        },
      }
    );

    let allpermissions = await Permission.findAll({
      where: {
        roleid: roleId,
      },
      raw: true,
    });

    for (const per of allpermissions) {
      await Permission.update(
        {
          status: 0,
        },
        {
          where: {
            id: per.id,
          },
        }
      );
    }

    for (const per of permissions) {
      let checkPermission = await Permission.findOne({
        where: {
          name: per,
        },
        raw: true,
      });
      if (checkPermission) {
        await Permission.update(
          {
            status: 1,
          },
          {
            where: {
              roleid: roleId,
              id: checkPermission.id,
            },
          }
        );
      } else {
        await Permission.create({
          name: per,
          roleid: roleId,
          status: 1,
        });
      }
    }

    success = true;
    return res.status(200).send({
      status: 200,
      success,
      message: "Role updated successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success,
      message: "Internal Server Error.",
    });
  }
};
