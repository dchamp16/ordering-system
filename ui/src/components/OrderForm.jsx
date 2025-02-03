import { useState } from 'react';
import { Plus, Minus, Loader } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    structurePO: '',
    structureName: '',
    orders: [{ hardwareOldNumber: '', quantity: 1 }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.includes('orders')) {
      const field = name.split('.')[1];
      const newOrders = [...formData.orders];
      newOrders[index][field] = value;
      setFormData({ ...formData, orders: newOrders });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addOrderItem = () => {
    setFormData({
      ...formData,
      orders: [...formData.orders, { hardwareOldNumber: '', quantity: 1 }]
    });
  };

  const removeOrderItem = (index) => {
    const newOrders = formData.orders.filter((_, i) => i !== index);
    setFormData({ ...formData, orders: newOrders });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/orders', formData);
      setSuccess('Order created successfully!');
      setFormData({
        empId: '',
        empName: '',
        structurePO: '',
        structureName: '',
        orders: [{ hardwareOldNumber: '', quantity: 1 }]
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Order</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name
            </label>
            <input
              type="text"
              name="empName"
              value={formData.empName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Structure PO
            </label>
            <input
              type="text"
              name="structurePO"
              value={formData.structurePO}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Structure Name
            </label>
            <input
              type="text"
              name="structureName"
              value={formData.structureName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Order Items</h3>
          {formData.orders.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hardware Number
                </label>
                <input
                  type="text"
                  name={`orders.hardwareOldNumber`}
                  value={item.hardwareOldNumber}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name={`orders.quantity`}
                  value={item.quantity}
                  onChange={(e) => handleInputChange(e, index)}
                  min="1"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {formData.orders.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOrderItem(index)}
                  className="mt-6 p-2 text-red-600 hover:text-red-800"
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addOrderItem}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Item
          </button>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              'Submit Order'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;