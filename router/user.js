const { Router } = require("express");
const {
  userLogin,
  editUser,
  getUser,
  changePassword,
  forgetPassword,
  resetPassword,
} = require("../controller/user");
const { checkUser } = require("../middleware/checkUser");

const router = Router();

router.post("/login", userLogin);

router.put("/update", checkUser, editUser);

router.get("/", checkUser, getUser);

router.post("/changepassword", checkUser, changePassword);

router.post("/forgetpassword", forgetPassword);

router.post("/resetpassword/:token", resetPassword);

module.exports = router;
