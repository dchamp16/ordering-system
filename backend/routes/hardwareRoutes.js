const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  verifyToken,
  verifyAdmin,
  verifySuperAdmin
} = require("../middleware/authMiddleware");
const {
  addHardware,
  updateHardware,
  deleteHardware,
  getHardware,
} = require("../controllers/hardwareController");
const { uploadHardware } = require("../controllers/excelController");

const upload = multer({ dest: "uploads/" });

router.get("/", getHardware);
router.post("/", verifyToken, verifySuperAdmin, addHardware);
router.put("/:id", verifyToken, verifySuperAdmin, updateHardware);
router.delete("/:id", verifyToken, verifySuperAdmin, deleteHardware);
router.post(
  "/upload",
  verifyToken,
  verifySuperAdmin,
  upload.single("file"),
  uploadHardware
);

module.exports = router;
