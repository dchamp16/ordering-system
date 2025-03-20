import { useState, useEffect } from 'react';
import { Loader, ArrowUpDown } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    structurePO: '',
    structureName: '',
    orders: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [hardwareItems, setHardwareItems] = useState([]);
  const [loadingHardware, setLoadingHardware] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // First set admin session
        await axiosInstance.get('/auth/set-admin-session');
        
        // Then fetch hardware
        const response = await axiosInstance.get('/hardware');
        console.log("Peter");
        setHardwareItems(response.data);
      } catch (err) {
        setError('Failed to load hardware items');
        console.error('Error fetching hardware:', err);
      } finally {
        setLoadingHardware(false);
      }
    };

    initializeSession();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (hardwareOldNumber, quantity) => {
    const item = hardwareItems.find(item => item.hardwareOldNumber === hardwareOldNumber);
    const maxQuantity = item?.quantity || 1;
    const newQuantity = Math.max(1, Math.min(parseInt(quantity) || 1, maxQuantity));
    
    setQuantities(prev => ({
      ...prev,
      [hardwareOldNumber]: newQuantity
    }));
  };

  const toggleItemSelection = (item) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(item.hardwareOldNumber)) {
      newSelected.delete(item.hardwareOldNumber);
      const newQuantities = { ...quantities };
      delete newQuantities[item.hardwareOldNumber];
      setQuantities(newQuantities);
    } else {
      newSelected.add(item.hardwareOldNumber);
      setQuantities(prev => ({
        ...prev,
        [item.hardwareOldNumber]: 1
      }));
    }
    setSelectedItems(newSelected);
  };

  const toggleSort = () => {
    setSortBy(prev => prev === 'name' ? 'oldNumber' : 'name');
  };

  const sortedHardwareItems = [...hardwareItems].sort((a, b) => 
    sortBy === 'name' 
      ? (a.hardwareName || '').localeCompare(b.hardwareName || '')
      : a.hardwareOldNumber.localeCompare(b.hardwareOldNumber)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.size === 0) {
      setError('Please select at least one item');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const orders = Array.from(selectedItems).map(hardwareOldNumber => ({
      hardwareOldNumber,
      quantity: quantities[hardwareOldNumber] || 1
    }));

    try {
      await axiosInstance.post('/orders', {
        ...formData,
        orders
      });
      setSuccess('Order created successfully!');
      setFormData({
        empId: '',
        empName: '',
        structurePO: '',
        structureName: '',
        orders: []
      });
      setSelectedItems(new Set());
      setQuantities({});
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (loadingHardware) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Hardware Items</h3>
            <button
              type="button"
              onClick={toggleSort}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Sort by {sortBy === 'name' ? 'Number' : 'Name'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Qty
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedHardwareItems.map((item, index) => (
                  <tr key={`${item.hardwareOldNumber}-${index}`} className={selectedItems.has(item.hardwareOldNumber) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.hardwareOldNumber)}
                        onChange={() => toggleItemSelection(item)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.hardwareOldNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.hardwareName || item.hardwareDescription}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.hardwareGroupName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={quantities[item.hardwareOldNumber] || 1}
                        onChange={(e) => handleQuantityChange(item.hardwareOldNumber, e.target.value)}
                        className="w-20 p-1 border rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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