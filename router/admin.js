const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const {
  adminLogin,
  createUser,
  addUserToTeam,
  createRole,
  assignRoleToUser,
  updateRoleAndPermission,
  getAllRoles,
  editUser,
  getAllUser,
  createTeam,
  editTeam,
  deleteTeam,
  removeTeamMember,
  getAllTeam,
  getSingleTeam,
} = require("../controller/admin");
const { checkAdmin } = require("../middleware/checkAdmin");
const router = Router();

// Auth
router.post("/login", adminLogin);

// User
router.post("/createuser", checkAdmin, createUser);

router.put("/updateuser/:id", checkAdmin, editUser);

router.get("/alluser", checkAdmin, getAllUser);

// Team
router.get("/all/team", checkAdmin, getAllTeam);

router.get("/team/:id", checkAdmin, getSingleTeam);

router.post("/add/team", checkAdmin, createTeam);

router.put("/update/team/:id", checkAdmin, editTeam);

router.delete("/delete/team/:id", checkAdmin, deleteTeam);

router.post("/add/teammember", checkAdmin, addUserToTeam);

router.post("/remove/teammember/:userId", checkAdmin, removeTeamMember);

router.post("/add/role", checkAdmin, createRole);

router.post("/assignrole", checkAdmin, assignRoleToUser);

router.post("/update/role", checkAdmin, updateRoleAndPermission);

router.get("/all/role", checkAdmin, getAllRoles);

router.get("/role/:roleId", checkAdmin);

module.exports = router;
