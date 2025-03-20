import { useState } from 'react';
import { Package, Loader, Search, RotateCcw } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const CheckOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchEmpId, setSearchEmpId] = useState('');
    const [returningOrder, setReturningOrder] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchEmpId.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.get(`/orders/${searchEmpId}`);
            setOrders(response.data);
        } catch (err) {
            setError('Failed to fetch orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (order, itemIndex) => {
        const item = order.orders[itemIndex];
        setReturningOrder(order._id + '-' + itemIndex);
        
        try {
            await axiosInstance.post('/orders/return', {
                returnerEmpId: order.empId,
                returnerName: order.empName,
                structurePO: order.structurePO,
                structureName: order.structureName,
                returning: [{
                    orderId: item._id,
                    hardwareOldNumber: item.hardwareOldNumber,
                    returnedQuantity: item.quantity
                }]
            });
            
            // Refresh orders after return
            const response = await axiosInstance.get(`/orders/${searchEmpId}`);
            setOrders(response.data);
        } catch (err) {
            setError('Failed to return item: ' + (err.response?.data?.error || err.message));
        } finally {
            setReturningOrder(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">Check Your Orders</h1>
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchEmpId}
                                    onChange={(e) => setSearchEmpId(e.target.value)}
                                    placeholder="Enter your Employee ID"
                                    className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Search Orders
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">
                            {searchEmpId ? 'No orders found for this Employee ID' : 'Enter your Employee ID to check your orders'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order Date</p>
                                        <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
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
                                            <div key={index} className="flex justify-between items-center py-2">
                                                <span className="font-medium">{item.hardwareOldNumber}</span>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-600">Qty: {item.quantity}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 rounded text-sm ${
                                                            item.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : item.status === 'Returned'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                        {item.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleReturn(order, index)}
                                                                disabled={returningOrder === `${order._id}-${index}`}
                                                                className="ml-2 p-1 text-blue-600 hover:text-blue-800 focus:outline-none disabled:opacity-50"
                                                                title="Return Item"
                                                            >
                                                                {returningOrder === `${order._id}-${index}` ? (
                                                                    <Loader className="h-5 w-5 animate-spin" />
                                                                ) : (
                                                                    <RotateCcw className="h-5 w-5" />
                                                                )}
                                                            </button>
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
        </div>
    );
};

export default CheckOrder;