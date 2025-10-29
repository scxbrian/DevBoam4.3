import React, { useState } from 'react';
import { Users, ShoppingCart, TrendingUp, Settings, Building, CreditCard } from 'lucide-react';
import ClientsTable from '../components/ClientsTable';
import AdminStats from '../components/AdminStats';
import ShopsTable from '../components/ShopsTable';
import BillingManagement from '../components/BillingManagement';
import PlatformSettings from '../components/PlatformSettings'; // Import the new component

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'shops', name: 'Shops', icon: Building },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DevBoma Admin</h1>
          <p className="text-gray-600">Manage all clients, services, and platform operations</p>
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
              <AdminStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Client Activity</h2>
                  <div className="space-y-3">
                    {[
                      { client: 'Artisan Crafts', action: 'New order received', time: '2 hours ago' },
                      { client: 'Tech Startup', action: 'Product added', time: '4 hours ago' },
                      { client: 'Wellness Hub', action: 'Payment processed', time: '6 hours ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{activity.client}</p>
                          <p className="text-sm text-gray-500">{activity.action}</p>
                        </div>
                        <span className="text-sm text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue by Tier</h2>
                  <div className="space-y-3">
                    {[
                      { tier: 'Boma Shop', revenue: 156000, percentage: 40 },
                      { tier: 'Boma Titan', revenue: 124500, percentage: 32 },
                      { tier: 'Boma Prime', revenue: 89700, percentage: 23 },
                      { tier: 'Boma Core', revenue: 19500, percentage: 5 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{item.tier}</span>
                          <span className="font-semibold text-green-600">
                            KES {item.revenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-700 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Clients</h2>
              <ClientsTable />
            </div>
          )}

          {activeTab === 'shops' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Shops</h2>
              <ShopsTable />
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing & Payments</h2>
              <BillingManagement />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Settings</h2>
              <PlatformSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}