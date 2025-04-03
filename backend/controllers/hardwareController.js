const Hardware = require("../models/hardwareModel");

exports.addHardware = async (req, res) => {
  try {
    const items = req.body;
    const result = Array.isArray(items)
      ? await Hardware.insertMany(items)
      : await Hardware.create(items);
    res
      .status(201)
      .json({ message: "Hardware items added successfully", result });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to add hardware items", message: err.message });
  }
};

exports.updateHardware = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedItem = await Hardware.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Hardware item not found" });
    }
    res.json({ message: "Hardware updated successfully", updatedItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to update hardware" });
  }
};

exports.deleteHardware = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Hardware.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Hardware item not found" });
    }
    res.json({ message: "Hardware item deleted successfully", deletedItem });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hardware item" });
  }
};

exports.getHardware = async (req, res) => {
  try {
    const items = await Hardware.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to get hardware items" });
  }
};
