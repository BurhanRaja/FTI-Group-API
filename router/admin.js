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
  getSingleRole,
} = require("../controller/admin");
const { checkAdmin } = require("../middleware/checkAdmin");
const router = Router();

// Auth
router.post(
  "/login",
  [
    check("email", "Email is required")
      .notEmpty()
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    check("password", "Password is required")
      .notEmpty()
      .exists()
      .withMessage("Email is required")
      .isLength({ min: 4 })
      .withMessage("Min. 4 characters for Password")
      .isLength({ max: 15 })
      .withMessage("Min. 4 characters for Password"),
  ],
  adminLogin
);

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

// Role
router.post("/add/role", checkAdmin, createRole);

router.post("/assignrole", checkAdmin, assignRoleToUser);

router.put("/update/role/:roleId", checkAdmin, updateRoleAndPermission);

router.get("/all/role", checkAdmin, getAllRoles);

router.get("/role/:roleId", checkAdmin, getSingleRole);

// Contracts

module.exports = router;
