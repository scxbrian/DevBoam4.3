
import React, { useState } from 'react';
import api from '../utils/api';

interface PlatformSettingsData {
  platformName: string;
  defaultCurrency: string;
  supportEmail: string;
}

const PlatformSettings: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettingsData>({
    platformName: 'DevBoma',
    defaultCurrency: 'KES',
    supportEmail: 'support@devboma.com',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // This endpoint doesn't exist yet, I'll create it later.
      await api.put('/admin/platform-settings', settings);
      setSuccess('Platform settings updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Name */}
        <div>
          <label htmlFor="platformName" className="block text-sm font-medium text-gray-700">
            Platform Name
          </label>
          <input
            type="text"
            name="platformName"
            id="platformName"
            value={settings.platformName}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Support Email */}
        <div>
          <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
            Support Email
          </label>
          <input
            type="email"
            name="supportEmail"
            id="supportEmail"
            value={settings.supportEmail}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700">
            Default Currency
          </label>
          <select
            name="defaultCurrency"
            id="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option>KES</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

export default PlatformSettings;
