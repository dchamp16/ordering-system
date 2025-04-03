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

// Remove verifyAdmin middleware from GET route temporarily for testing
router.get("/", getHardware);
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
    uploadHardware
);

module.exports = router;