import { useState, useEffect } from 'react';
import { Package, Loader } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                <h1 className="text-2xl font-bold mb-6">All Orders</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No orders found</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                                            <div key={index} className="flex justify-between items-center">
                                                <span>{item.hardwareOldNumber}</span>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-gray-600">Qty: {item.quantity}</span>
                                                    <span className={`px-2 py-1 rounded text-sm ${
                                                        item.status === 'Pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                            {item.status}
                          </span>
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

export default AdminDashboard;