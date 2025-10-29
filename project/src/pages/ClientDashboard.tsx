import React, { useState } from 'react';
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Settings } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import OrdersTable from '../components/OrdersTable';
import ProductsGrid from '../components/ProductsGrid';
import CustomersTable from '../components/CustomersTable';
import ShopSettings from '../components/ShopSettings'; // Import the new component

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Dashboard</h1>
          <p className="text-gray-600">Manage your online store and track performance</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-700 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <DashboardStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                  <OrdersTable limit={5} />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
                  <div className="space-y-3">
                    {[
                      { name: 'Premium T-Shirt', sales: 45, revenue: 67500 },
                      { name: 'Designer Mug', sales: 32, revenue: 38400 },
                      { name: 'Canvas Bag', sales: 28, revenue: 42000 }
                    ].map((product, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                        <span className="font-semibold text-green-600">
                          KES {product.revenue.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <ProductsGrid />}
          
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Orders</h2>
              <OrdersTable />
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Management</h2>
              <CustomersTable />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop Settings</h2>
              <ShopSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}