const Order = require("../models/orderModel");
const AuditLog = require("../models/auditLogModel");
const Hardware = require("../models/hardwareModel");

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
            structurename,
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

            // Deduct stock and save
            hardware.quantity -= quantity;
            await hardware.save();

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
                    structurename,
                },
            });
        }

        // Create the order document
        const newOrder = new Order({
            empId,
            empName,
            structurePO, // Save structurePO
            structurename,
            orders: processedOrders,
        });

        await newOrder.save();

        res.status(201).json({
            message: "Orders created successfully",
            newOrder
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({
            error: "Failed to create order",
            details: err.message
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

const returnOrder = async (req, res) => {
    try {
        const {
            returnerEmpId,
            returnerName,
            returning
        } = req.body;

        const results = {
            success: [],
            skipped: [],
            errors: [],
        };

        for (const item of returning) {
            const {
                orderId,
                returnedQuantity
            } = item;

            try {
                if (returnedQuantity <= 0) {
                    results.errors.push({
                        orderId,
                        error: "Returned quantity must be greater than zero",
                    });
                    continue;
                }

                // Find the parent order document containing the subdocument
                const parentOrder = await Order.findOne({"orders._id": orderId});
                if (!parentOrder) {
                    results.errors.push({
                        orderId,
                        error: "Order not found",
                    });
                    continue;
                }

                // Locate the specific subdocument
                const orderItem = parentOrder.orders.id(orderId);
                if (!orderItem) {
                    results.errors.push({
                        orderId,
                        error: "Order item not found in the orders array",
                    });
                    continue;
                }

                // Skip if order item quantity is already 0
                if (orderItem.quantity === 0) {
                    results.skipped.push({
                        orderId,
                        message: "Order item quantity is already 0, cannot process return",
                    });
                    continue;
                }

                // Calculate the actual quantity to return
                const actualReturnedQuantity = Math.min(returnedQuantity, orderItem.quantity);

                // Update the order item quantity
                orderItem.quantity -= actualReturnedQuantity;
                if (orderItem.quantity === 0) {
                    orderItem.status = "Returned";
                }

                // Find the corresponding hardware
                const hardware = await Hardware.findOne({hardwareOldNumber: orderItem.hardwareOldNumber});
                if (!hardware) {
                    results.errors.push({
                        orderId,
                        error: `Hardware not found: ${orderItem.hardwareOldNumber}`,
                    });
                    continue;
                }

                // Update the hardware stock
                hardware.quantity += actualReturnedQuantity;
                await hardware.save();

                // Save the updated parent order document
                await parentOrder.save();

                // Create an audit log
                await AuditLog.create({
                    action: "Order Returned",
                    performedBy: `${returnerName} (EmpID: ${returnerEmpId})`,
                    details: {
                        orderId: parentOrder._id,
                        hardwareOldNumber: orderItem.hardwareOldNumber,
                        returnedQuantity: actualReturnedQuantity,
                        newOrderQuantity: orderItem.quantity,
                        newStock: hardware.quantity,
                        structurePO: parentOrder.structurePO, // Include structurePO
                        structurename: parentOrder.structurename,
                    },
                });

                // Add to success results
                results.success.push({
                    orderId,
                    hardwareOldNumber: orderItem.hardwareOldNumber,
                    returnedQuantity: actualReturnedQuantity,
                    newOrderQuantity: orderItem.quantity,
                    newStock: hardware.quantity,
                });
            } catch (err) {
                results.errors.push({
                    orderId,
                    error: err.message,
                });
            }
        }

        res.json({
            message: "Order return processing completed",
            results,
        });
    } catch (err) {
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
    returnOrder
};
