import { useState, useEffect } from 'react';
import { Loader, ChevronUp, ChevronDown } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
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
  const [sortConfig, setSortConfig] = useState({ key: 'hardwareOldNumber', direction: 'asc' });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [hardwareItems, setHardwareItems] = useState([]);
  const [loadingHardware, setLoadingHardware] = useState(true);

  const fetchHardwareItems = async () => {
    try {
      const response = await axiosInstance.get('/hardware');
      setHardwareItems(response.data);
    } catch (err) {
      setError('Failed to load hardware items');
      console.error('Error fetching hardware:', err);
    } finally {
      setLoadingHardware(false);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await axiosInstance.get('/auth/set-admin-session');
        await fetchHardwareItems();
      } catch (err) {
        setError('Failed to load hardware items');
        console.error('Error fetching hardware:', err);
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

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedHardwareItems = [...hardwareItems].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle special cases for nested or computed values
    if (sortConfig.key === 'hardwareName') {
      aValue = a.hardwareName || a.hardwareDescription || '';
      bValue = b.hardwareName || b.hardwareDescription || '';
    }

    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    const comparison = aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

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
      
      // Show success toast
      toast.success('Order submitted successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
        },
      });

      // Reset form
      setFormData({
        empId: '',
        empName: '',
        structurePO: '',
        structureName: '',
        orders: []
      });
      setSelectedItems(new Set());
      setQuantities({});

      // Refresh hardware items
      await fetchHardwareItems();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create order';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
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
      <Toaster />
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
          <h3 className="text-lg font-medium">Hardware Items</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('hardwareOldNumber')}
                  >
                    <div className="flex items-center">
                      Hardware Name
                      <SortIcon columnKey="hardwareOldNumber" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('hardwareName')}
                  >
                    <div className="flex items-center">
                      Description
                      <SortIcon columnKey="hardwareName" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('hardwareGroupName')}
                  >
                    <div className="flex items-center">
                      Group
                      <SortIcon columnKey="hardwareGroupName" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      Available
                      <SortIcon columnKey="quantity" />
                    </div>
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
                      {item.hardwareOldNumber.toUpperCase()}
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