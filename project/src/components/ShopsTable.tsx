
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

interface Shop {
  _id: string;
  shopName: string;
  clientName: string;
  plan: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
}

const ShopsTable: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        // This endpoint doesn't exist yet, I'll create it later.
        // const response = await api.get('/admin/shops'); 

        // Mock data for now
        const mockShops: Shop[] = [
          { _id: '1', shopName: 'Artisan Crafts', clientName: 'John Doe', plan: 'Boma Shop', status: 'Active', createdAt: '2023-01-15' },
          { _id: '2', shopName: 'Tech Startup', clientName: 'Jane Smith', plan: 'Boma Titan', status: 'Active', createdAt: '2023-02-20' },
          { _id: '3', shopName: 'Wellness Hub', clientName: 'Peter Jones', plan: 'Boma Prime', status: 'Inactive', createdAt: '2023-03-10' },
          { _id: '4', shopName: 'Gourmet Foods', clientName: 'Mary Anne', plan: 'Boma Shop', status: 'Suspended', createdAt: '2023-04-05' },
        ];
        
        setShops(mockShops);
        // setShops(response.data);

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch shops.');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const getStatusBadge = (status: Shop['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Shop Name
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Client
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Plan
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Created On
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {shops.map((shop) => (
            <tr key={shop._id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {shop.shopName}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {shop.clientName}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {shop.plan}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(shop.status)}`}>
                  {shop.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(shop.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopsTable;
