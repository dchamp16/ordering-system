import { useState, useEffect } from 'react';
import { Loader, Plus, Upload, Trash2, Edit2, Search } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

const HardwareManagement = () => {
    const [hardware, setHardware] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedHardware, setSelectedHardware] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        hardwareName: '',
        hardwareOldNumber: '',
        hardwarePO: '',
        hardwareGroupName: '',
        quantity: 0,
        hardwareDescription: ''
    });

    const fetchHardware = async () => {
        try {
            const response = await axiosInstance.get('/hardware');
            setHardware(response.data);
        } catch (err) {
            toast.error('Failed to fetch hardware items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHardware();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (showEditModal) {
                await axiosInstance.put(`/hardware/${selectedHardware._id}`, formData);
                toast.success('Hardware updated successfully');
            } else {
                await axiosInstance.post('/hardware', formData);
                toast.success('Hardware added successfully');
            }
            setShowAddModal(false);
            setShowEditModal(false);
            setFormData({
                hardwareName: '',
                hardwareOldNumber: '',
                hardwarePO: '',
                hardwareGroupName: '',
                quantity: 0,
                hardwareDescription: ''
            });
            fetchHardware();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this hardware item?')) return;

        try {
            await axiosInstance.delete(`/hardware/${id}`);
            toast.success('Hardware deleted successfully');
            fetchHardware();
        } catch (err) {
            toast.error('Failed to delete hardware');
        }
    };

    const handleEdit = (item) => {
        setSelectedHardware(item);
        setFormData({
            hardwareName: item.hardwareName || '',
            hardwareOldNumber: item.hardwareOldNumber,
            hardwarePO: item.hardwarePO,
            hardwareGroupName: item.hardwareGroupName,
            quantity: item.quantity,
            hardwareDescription: item.hardwareDescription
        });
        setShowEditModal(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/hardware/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(`${response.data.message}`);
            fetchHardware();
        } catch (err) {
            toast.error('Failed to upload file');
        }
    };

    const filteredHardware = hardware.filter(item =>
        item.hardwareOldNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.hardwareName && item.hardwareName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.hardwareGroupName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Modal = ({ onClose, title }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hardware Name</label>
                            <input
                                type="text"
                                value={formData.hardwareOldNumber}
                                onChange={(e) => setFormData({ ...formData, hardwareOldNumber: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hardware PO</label>
                            <input
                                type="text"
                                value={formData.hardwarePO}
                                onChange={(e) => setFormData({ ...formData, hardwarePO: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Group Name</label>
                            <input
                                type="text"
                                value={formData.hardwareGroupName}
                                onChange={(e) => setFormData({ ...formData, hardwareGroupName: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.hardwareDescription}
                                onChange={(e) => setFormData({ ...formData, hardwareDescription: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                rows="3"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {showEditModal ? 'Update' : 'Add'} Hardware
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Toaster />
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <div className="flex-1 max-w-md w-full">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search hardware..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Excel
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".xlsx,.xls"
                        />
                    </label>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Hardware
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hardware Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Group
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PO
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredHardware.map((item) => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.hardwareOldNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.hardwareName || item.hardwareDescription}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.hardwareGroupName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.hardwarePO}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.quantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(showAddModal || showEditModal) && (
                <Modal
                    onClose={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                    }}
                    title={showEditModal ? 'Edit Hardware' : 'Add New Hardware'}
                />
            )}
        </div>
    );
};

export default HardwareManagement;