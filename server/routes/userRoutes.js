const express = require("express");
const router = express.Router();
const {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { verifyAdmin } = require("../middleware/auth");

router.use(verifyAdmin);

router.post("/", addUser);
router.get("/", getUsers);
router.put("/:id", updateUser); // Update a user
router.delete("/:id", deleteUser); // Delete a user

module.exports = router;
