const Hardware = require("../models/hardwareModel");
const xlsx = require("xlsx");
const fs = require("fs");

exports.uploadHardware = async (req, res) => {
  try {
    const file = xlsx.readFile(req.file.path);
    const sheet = file.Sheets[file.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const results = [];
    const duplicates = [];
    const errors = [];
    const newItems = [];

    for (const item of data) {
      try {
        if (
          !item.hardwareOldNumber ||
          !item.hardwarePO ||
          !item.hardwareGroupName ||
          !item.quantity ||
          !item.hardwareDescription
        ) {
          errors.push({ item, message: "Missing required fields" });
          continue;
        }
        const exists = await Hardware.findOne({
          hardwarePO: item.hardwarePO,
          hardwareOldNumber: item.hardwareOldNumber,
        });
        if (exists) {
          duplicates.push({
            item,
            reason: "Duplicate hardwarePO and hardwareOldNumber combination",
          });
        } else {
          newItems.push(item);
        }
      } catch (err) {
        errors.push({ item, error: err.message });
      }
    }
    if (newItems.length > 0) {
      const addedItems = await Hardware.insertMany(newItems);
      results.push(...addedItems);
    }
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: `${results.length} items added successfully.`,
      duplicates: `${duplicates.length} duplicate items ignored.`,
      errors: errors.length > 0 ? errors : null,
      addedItems: results,
      duplicateItems: duplicates,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to process Excel file", details: err.message });
  }
};
