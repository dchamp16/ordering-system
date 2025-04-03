const express = require("express");
const router = express.Router();
const {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { verifyAdmin, verifySuperAdmin } = require("../middleware/auth");

router.use(verifyAdmin);

router.post("/", verifySuperAdmin, addUser); // Only Super Admin can add users
router.get("/", getUsers); // Admins and Super Admins can view users
router.put("/:id", verifySuperAdmin, updateUser); // Only Super Admin can update users
router.delete("/:id", verifySuperAdmin, deleteUser); // Only Super Admin can delete users

module.exports = router;
