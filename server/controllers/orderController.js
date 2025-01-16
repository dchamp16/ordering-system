const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const AuditLog = require("../models/auditLogModel");
const Hardware = require("../models/hardwareModel");
const Structure = require("../models/structureModel");

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({error: "Failed to fetch orders"});
    }
};

const getEmpOrders = async (req, res) => {
    try {
        const {empId} = req.params;
        const orders = await Order.find({empId});
        res.json(orders);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch orders"});
    }
};

const createOrder = async (req, res) => {
    try {
        const {
            empId,
            empName,
            structurePO,
            structureName,
            orders
        } = req.body;

        const processedOrders = [];

        for (const order of orders) {
            const {
                hardwareOldNumber,
                quantity
            } = order;

            if (quantity <= 0) {
                return res.status(400).json({error: "Order quantity must be greater than zero"});
            }

            const hardware = await Hardware.findOne({hardwareOldNumber});
            if (!hardware) {
                return res.status(404).json({error: `Hardware not found: ${hardwareOldNumber}`});
            }

            if (hardware.quantity < quantity) {
                return res.status(400).json({error: `Insufficient stock for hardware ${hardwareOldNumber}`});
            }

            // Deduct stock from hardware
            hardware.quantity -= quantity;
            await hardware.save();

            // Find or create the structure
            let structure = await Structure.findOne({structurePO});
            if (!structure) {
                structure = new Structure({
                    structurePO,
                    structureName,
                    hardwareAllocation: [], // Initialize as an empty array
                });
            }

            // Ensure `hardwareAllocation` is an array
            structure.hardwareAllocation = structure.hardwareAllocation || [];

            // Find or add the hardware allocation
            let allocationIndex = structure.hardwareAllocation.findIndex(
                (item) => item.hardwareOldNumber === hardwareOldNumber
            );

            if (allocationIndex === -1) {
                // If hardware is not found in the allocation, add it
                structure.hardwareAllocation.push({
                    hardwareOldNumber,
                    quantity
                });
            } else {
                // Update the quantity for the existing allocation
                structure.hardwareAllocation[allocationIndex].quantity += quantity;
            }

            await structure.save();

            processedOrders.push({
                hardwareOldNumber,
                quantity,
                status: "Pending",
            });

            // Log the action for each order
            await AuditLog.create({
                action: "Order Created",
                performedBy: empName,
                details: {
                    hardwareOldNumber,
                    orderedQuantity: quantity,
                    remainingStock: hardware.quantity,
                    structurePO,
                    structureName,
                },
            });
        }

        // Create the order document
        const newOrder = new Order({
            empId,
            empName,
            structurePO,
            structureName,
            orders: processedOrders,
        });

        await newOrder.save();

        res.status(201).json({
            message: "Orders created successfully",
            newOrder,
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({
            error: "Failed to create order",
            details: err.message,
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const {id} = req.params;
        const updateOrder = await Order.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateOrder) {
            return res.status(404).json({error: "Order not found"});
        }
        return res.json(updateOrder);
    } catch (err) {
        res.status(400).json({error: "Failed to update order"});
    }
};

const deleteOrder = async (req, res) => {
    try {
        const {id} = req.params;
        console.log("Order ID to delete:", id); // Debugging

        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            console.log("Order not found in database."); // Debugging
            return res.status(404).json({error: "Order not found"});
        }

        console.log("Order deleted:", deletedOrder); // Debugging

        // Log the action
        await AuditLog.create({
            action: "Order Deleted",
            performedBy: req.session?.user?.username || "Unknown",
            details: {orderId: id},
        });

        res.json({message: "Order deleted successfully"});
    } catch (err) {
        console.error("Error deleting order:", err); // Debugging
        res.status(400).json({error: "Failed to delete order"});
    }
};

const returnHardware = async (req, res) => {
    try {
        const {
            returnerEmpId,
            returnerName,
            structurePO,
            structureName,
            returning
        } = req.body;

        if (!structurePO || !structureName) {
            return res.status(400).json({error: "StructurePO and structureName are required"});
        }

        if (!Array.isArray(returning) || returning.length === 0) {
            return res.status(400).json({error: "Returning array must not be empty"});
        }

        const results = {
            success: [],
            skipped: [],
            errors: [],
        };

        // Find the structure
        let structure = await Structure.findOne({structurePO});
        if (!structure) {
            return res.status(404).json({error: `Structure not found: ${structurePO}`});
        }

        for (const item of returning) {
            let {
                orderId,
                hardwareOldNumber,
                returnedQuantity
            } = item;

            try {
                if (returnedQuantity <= 0) {
                    results.errors.push({
                        orderId,
                        hardwareOldNumber,
                        error: "Returned quantity must be greater than zero",
                    });
                    continue;
                }

                let orderItem = null;
                let parentOrder = null;

                if (orderId) {
                    // Handle return by orderId
                    parentOrder = await Order.findOne({"orders._id": new mongoose.Types.ObjectId(orderId)});
                    if (!parentOrder) {
                        results.errors.push({
                            orderId,
                            error: "Order not found"
                        });
                        continue;
                    }

                    orderItem = parentOrder.orders.id(orderId);
                    if (!orderItem) {
                        results.errors.push({
                            orderId,
                            error: "Order item not found in the order"
                        });
                        continue;
                    }

                    // Ensure the hardwareOldNumber matches the order item
                    if (orderItem.hardwareOldNumber !== hardwareOldNumber) {
                        results.errors.push({
                            orderId,
                            hardwareOldNumber,
                            error: `HardwareOldNumber mismatch for the provided orderId`,
                        });
                        continue;
                    }
                }

                if (!hardwareOldNumber) {
                    results.errors.push({
                        orderId,
                        error: "HardwareOldNumber is required if orderId is NULL"
                    });
                    continue;
                }

                // Normalize hardwareOldNumber
                hardwareOldNumber = hardwareOldNumber.trim().toLowerCase();

                // Ensure `hardwareAllocation` is an array
                structure.hardwareAllocation = structure.hardwareAllocation || [];

                // Find the hardware allocation in the structure
                const allocation = structure.hardwareAllocation.find(
                    (item) => item.hardwareOldNumber.trim().toLowerCase() === hardwareOldNumber
                );

                if (!allocation) {
                    results.errors.push({
                        hardwareOldNumber,
                        error: `Allocation not found for hardware ${hardwareOldNumber} in structure ${structurePO}`,
                    });
                    continue;
                }

                // Ensure sufficient allocation exists
                if (allocation.quantity < returnedQuantity) {
                    results.errors.push({
                        hardwareOldNumber,
                        error: `Insufficient allocation for hardware ${hardwareOldNumber} in structure ${structurePO}`,
                    });
                    continue;
                }

                // Deduct from structure allocation
                allocation.quantity -= returnedQuantity;
                await structure.save();

                // Update the hardware stock
                const hardware = await Hardware.findOne({hardwareOldNumber});
                if (!hardware) {
                    results.errors.push({
                        hardwareOldNumber,
                        error: `Hardware not found: ${hardwareOldNumber}`
                    });
                    continue;
                }

                hardware.quantity += returnedQuantity;
                await hardware.save();

                if (orderId) {
                    // Deduct from the specific order
                    orderItem.quantity -= returnedQuantity;

                    // Mark item as returned if quantity is zero or less
                    if (orderItem.quantity <= 0) {
                        orderItem.quantity = 0;
                        orderItem.status = "Returned";
                    }

                    parentOrder.markModified("orders");
                    await parentOrder.save();
                } else {
                    // Handle deduction from multiple orders
                    const orders = await Order.find({
                        structurePO,
                        "orders.hardwareOldNumber": hardwareOldNumber,
                    }).sort({date: 1}); // Oldest orders first

                    let remainingToDeduct = returnedQuantity;

                    for (const order of orders) {
                        for (const subOrder of order.orders) {
                            if (subOrder.hardwareOldNumber === hardwareOldNumber && remainingToDeduct > 0) {
                                const deductAmount = Math.min(subOrder.quantity, remainingToDeduct);
                                subOrder.quantity -= deductAmount;
                                remainingToDeduct -= deductAmount;

                                if (subOrder.quantity <= 0) {
                                    subOrder.quantity = 0;
                                    subOrder.status = "Returned";
                                }

                                order.markModified("orders");
                                await order.save();
                            }

                            if (remainingToDeduct <= 0) break;
                        }

                        if (remainingToDeduct <= 0) break;
                    }

                    if (remainingToDeduct > 0) {
                        results.errors.push({
                            hardwareOldNumber,
                            error: `Could not deduct entire returnedQuantity from orders for hardware ${hardwareOldNumber}`,
                        });
                        continue;
                    }
                }

                // Log the return action
                await AuditLog.create({
                    action: "Hardware Returned",
                    performedBy: `${returnerName} (EmpID: ${returnerEmpId})`,
                    details: {
                        structurePO,
                        structureName,
                        hardwareOldNumber,
                        returnedQuantity,
                        newStock: hardware.quantity,
                        newStructureAllocation: allocation.quantity,
                    },
                });

                results.success.push({
                    orderId: orderItem ? orderItem._id : null,
                    hardwareOldNumber,
                    returnedQuantity,
                    newStock: hardware.quantity,
                    structureAllocation: allocation.quantity,
                });
            } catch (err) {
                results.errors.push({
                    orderId,
                    hardwareOldNumber,
                    error: err.message,
                });
            }
        }

        res.json({
            message: "Return processing completed",
            results,
        });
    } catch (err) {
        console.error("Error processing returns:", err);
        res.status(500).json({
            error: "Failed to process returns",
            details: err.message,
        });
    }
};


module.exports = {
    getAllOrders,
    getEmpOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    returnHardware
};
