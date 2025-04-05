const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyAdmin,
  verifySuperAdmin
} = require("../middleware/authMiddleware");
const {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

router.use(verifyToken, verifyAdmin);

router.post("/", verifySuperAdmin, addUser);
router.get("/", getUsers);
router.put("/:id", verifySuperAdmin, updateUser);
router.delete("/:id", verifySuperAdmin, deleteUser);

module.exports = router;
