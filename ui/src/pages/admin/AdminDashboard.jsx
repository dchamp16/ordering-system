import { useState, useEffect } from 'react';
import { Package, Loader, RotateCcw, ChevronDown, Filter } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [returningOrder, setReturningOrder] = useState(null);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [filterStatus, setFilterStatus] = useState('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/orders');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to fetch orders');
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, itemId, newStatus) => {
        setShowConfirmDialog({
            title: `Mark as ${newStatus}?`,
            message: `Are you sure you want to mark this order as ${newStatus.toLowerCase()}?`,
            action: () => executeStatusChange(orderId, itemId, newStatus)
        });
        setShowStatusDropdown(null);
    };

    const executeStatusChange = async (orderId, itemId, newStatus) => {
        try {
            await axiosInstance.put(`/admin/orders/${orderId}`, {
                itemId,
                status: newStatus
            });
            
            toast.success('Status updated successfully');
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
        setShowConfirmDialog(null);
    };

    const handleReturnQuantityChange = (orderId, itemId, quantity, maxQuantity) => {
        const key = `${orderId}-${itemId}`;
        const newQuantity = Math.min(Math.max(1, parseInt(quantity) || 0), maxQuantity);
        setReturnQuantities(prev => ({
            ...prev,
            [key]: newQuantity
        }));
    };

    const handleReturn = async (order, itemIndex) => {
        const item = order.orders[itemIndex];
        const returnKey = `${order._id}-${item._id}`;
        const returnQuantity = returnQuantities[returnKey] || item.quantity;
        
        if (!returnQuantity || returnQuantity <= 0 || returnQuantity > item.quantity) {
            toast.error('Invalid return quantity');
            return;
        }

        setShowConfirmDialog({
            title: 'Confirm Return',
            message: `Are you sure you want to return ${returnQuantity} item(s)?`,
            action: () => executeReturn(order, itemIndex, returnQuantity)
        });
    };

    const executeReturn = async (order, itemIndex, returnQuantity) => {
        const item = order.orders[itemIndex];
        const returnKey = `${order._id}-${item._id}`;
        setReturningOrder(returnKey);
        
        try {
            await axiosInstance.post('/orders/return', {
                returnerEmpId: order.empId,
                returnerName: order.empName,
                structurePO: order.structurePO,
                structureName: order.structureName,
                returning: [{
                    orderId: item._id,
                    hardwareOldNumber: item.hardwareOldNumber,
                    returnedQuantity: returnQuantity
                }]
            });
            
            toast.success('Items returned successfully');
            fetchOrders();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError('Failed to return item: ' + errorMessage);
            toast.error(errorMessage);
        } finally {
            setReturningOrder(null);
            setShowConfirmDialog(null);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'all') return true;
        return order.orders.some(item => item.status === filterStatus);
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 relative">
            <Toaster />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <h1 className="text-2xl font-bold">All Orders</h1>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                        {error}
                    </div>
                )}

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No orders found</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order Date</p>
                                        <p className="font-medium">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Employee</p>
                                        <p className="font-medium">{order.empName} (ID: {order.empId})</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Structure</p>
                                        <p className="font-medium">{order.structureName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Structure PO</p>
                                        <p className="font-medium">{order.structurePO}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-2">Order Items</h3>
                                    <div className="space-y-2">
                                        {order.orders.map((item, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 space-y-2 sm:space-y-0">
                                                <span className="font-medium">{item.hardwareOldNumber}</span>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                                    <span className="text-gray-600">Qty: {item.quantity}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setShowStatusDropdown(item._id)}
                                                                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                                                                    item.status === 'Pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}
                                                            >
                                                                <span>{item.status}</span>
                                                                <ChevronDown className="h-4 w-4" />
                                                            </button>
                                                            {showStatusDropdown === item._id && (
                                                                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-10">
                                                                    <div className="py-1">
                                                                        {['Pending', 'Completed'].map((status) => (
                                                                            <button
                                                                                key={status}
                                                                                onClick={() => handleStatusChange(order._id, item._id, status)}
                                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                            >
                                                                                {status}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {item.status === 'Pending' && (
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max={item.quantity}
                                                                    value={returnQuantities[`${order._id}-${item._id}`] || item.quantity}
                                                                    onChange={(e) => handleReturnQuantityChange(order._id, item._id, e.target.value, item.quantity)}
                                                                    className="w-16 p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                                <button
                                                                    onClick={() => handleReturn(order, index)}
                                                                    disabled={returningOrder === `${order._id}-${item._id}`}
                                                                    className="ml-2 p-1 text-blue-600 hover:text-blue-800 focus:outline-none disabled:opacity-50"
                                                                    title="Return Item"
                                                                >
                                                                    {returningOrder === `${order._id}-${item._id}` ? (
                                                                        <Loader className="h-5 w-5 animate-spin" />
                                                                    ) : (
                                                                        <RotateCcw className="h-5 w-5" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-2">{showConfirmDialog.title}</h3>
                        <p className="text-gray-600 mb-4">{showConfirmDialog.message}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowConfirmDialog(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={showConfirmDialog.action}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;