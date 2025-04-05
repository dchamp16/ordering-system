const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AuditLog = require("../models/auditLogModel");

exports.addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();

    // Log the action
    await AuditLog.create({
      action: "User Added",
      performedBy: req.session?.user?.username || "Unknown",
      details: { username, role },
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    res.status(400).json({ error: "Failed to add user" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Log the action
    await AuditLog.create({
      action: "User Deleted",
      performedBy: req.user?.username || "Unknown",
      details: { userId: id, username: user.username },
    });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.username = username || user.username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};
