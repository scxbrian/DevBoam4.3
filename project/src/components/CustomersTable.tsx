
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

// Define the shape of a Customer object
interface Customer {
  _id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // This endpoint doesn't exist yet, I'll create it later.
        const response = await api.get('/client/customers'); 
        
        // Mock data for now
        const mockCustomers = [
          { _id: '1', name: 'John Doe', email: 'john@example.com', totalOrders: 5, totalSpent: 15000, lastOrder: '2023-10-27' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', totalOrders: 3, totalSpent: 8500, lastOrder: '2023-10-25' },
          { _id: '3', name: 'Peter Jones', email: 'peter@example.com', totalOrders: 8, totalSpent: 25000, lastOrder: '2023-10-28' },
        ];
        
        setCustomers(mockCustomers);
        // setCustomers(response.data);

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch customers.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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
              Name
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Contact
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Total Orders
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Total Spent
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Last Order
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {customer.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {customer.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {customer.totalOrders}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                KES {customer.totalSpent.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(customer.lastOrder).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;
