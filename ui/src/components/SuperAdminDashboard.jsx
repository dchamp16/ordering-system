import { useState } from 'react';
import { Users, Package, ClipboardList, Upload, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminManagement from '../pages/superadmin/AdminManagement';
import HardwareManagement from '../pages/superadmin/HardwareManagement';
import AuditLogs from '../pages/superadmin/AuditLogs';
import AdminDashboard from '../pages/admin/AdminDashboard';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: 'orders', label: 'Orders Dashboard', icon: ClipboardList },
    { id: 'admins', label: 'Admin Management', icon: Users },
    { id: 'hardware', label: 'Hardware Management', icon: Package },
    { id: 'logs', label: 'Audit Logs', icon: ClipboardList },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.get('/auth/logout');
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <AdminDashboard />;
      case 'admins':
        return <AdminManagement />;
      case 'hardware':
        return <HardwareManagement />;
      case 'logs':
        return <AuditLogs />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-lg shadow"
          >
            <Menu className="h-5 w-5 mr-2" />
            {tabs.find(tab => tab.id === activeTab)?.label}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mb-4 bg-white rounded-lg shadow-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors mb-2 last:mb-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop Tabs */}
        <div className="hidden sm:flex space-x-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;