
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

interface Transaction {
  _id: string;
  clientName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const BillingManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // This endpoint doesn't exist yet, I'll create it later.
        // const response = await api.get('/admin/billing'); 

        // Mock data for now
        const mockTransactions: Transaction[] = [
          { _id: '1', clientName: 'Artisan Crafts', amount: 5000, date: '2023-10-28', status: 'Completed' },
          { _id: '2', clientName: 'Tech Startup', amount: 12000, date: '2023-10-27', status: 'Completed' },
          { _id: '3', clientName: 'Wellness Hub', amount: 7500, date: '2023-10-26', status: 'Pending' },
          { _id: '4', clientName: 'Gourmet Foods', amount: 5000, date: '2023-10-25', status: 'Failed' },
        ];
        
        setTransactions(mockTransactions);
        // setTransactions(response.data);

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
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
              Client
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Amount
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Date
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {transaction.clientName}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                KES {transaction.amount.toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingManagement;
