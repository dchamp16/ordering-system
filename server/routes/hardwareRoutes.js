const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addHardware,
  updateHardware,
  deleteHardware,
  getHardware,
} = require("../controllers/hardwareController");
const { verifySuperAdmin, verifyAdmin } = require("../middleware/auth");
const { uploadHardware } = require("../controllers/excelController");
const upload = multer({ dest: "uploads/" });

router.get("/", verifyAdmin, getHardware); //admin can only view
router.post("/", verifySuperAdmin, addHardware);
router.put("/:id", verifySuperAdmin, updateHardware);
router.delete("/:id", verifySuperAdmin, deleteHardware);
router.post(
  "/upload",
  verifySuperAdmin,
  upload.single("file"),
  (req, res, next) => {
    console.log("File uploaded:", req.file);
    next();
  },
  uploadHardware,
);

module.exports = router;
