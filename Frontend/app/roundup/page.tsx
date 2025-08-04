// app/roundup/page.tsx
'use client';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { roundupAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function RoundupPage() {
  const [settings, setSettings] = useState({
    enabled: false,
    roundUpTo: 10,
    portfolio: 'balanced',
    savingsGoal: 50000,
    currentSavings: 32500
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await roundupAPI.getSettings();
      setSettings(response.data.settings || settings);
    } catch (error) {
      console.error('Error fetching roundup settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await roundupAPI.updateSettings(newSettings);
      setSettings(newSettings);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  const handleToggle = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    updateSettings(newSettings);
  };

  const handleRoundUpChange = (value) => {
    const newSettings = { ...settings, roundUpTo: parseInt(value) };
    updateSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Round-Up Settings</h1>
          <p className="text-gray-600">Customize your spare change investing preferences</p>
        </div>

        {/* Round-Up Toggle */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Round-Up Investing</h3>
              <p className="text-gray-600">Automatically invest your spare change from everyday purchases</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={handleToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </Card>

        {/* Round-Up Amount */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Round up to nearest:</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[5, 10, 20].map(amount => (
              <button
                key={amount}
                onClick={() => handleRoundUpChange(amount)}
                className={`p-4 rounded-lg border-2 font-medium transition-colors ${
                  settings.roundUpTo === amount
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Example</h4>
            <p className="text-gray-600">
              If you spend ₹{237}, we'll round up to ₹{240} and invest the ₹{settings.roundUpTo - (237 % settings.roundUpTo)} difference in your selected portfolio.
            </p>
          </div>
        </Card>

        {/* Savings Goal */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Savings Goal Tracker</h3>
          <p className="text-gray-600 mb-4">Set and track your investment targets</p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round((settings.currentSavings / settings.savingsGoal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(settings.currentSavings / settings.savingsGoal) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹{settings.currentSavings.toLocaleString()}</span>
              <span>₹{settings.savingsGoal.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Savings Goal (₹)
              </label>
              <input
                type="number"
                value={settings.savingsGoal}
                onChange={(e) => setSettings({...settings, savingsGoal: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => updateSettings(settings)}>
                Update Goal
              </Button>
            </div>
          </div>
        </Card>

        {/* Portfolio Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Investment Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'conservative', name: 'Conservative', risk: 'Low Risk', return: '6-8%' },
              { id: 'balanced', name: 'Balanced', risk: 'Medium Risk', return: '8-12%' },
              { id: 'aggressive', name: 'Aggressive', risk: 'High Risk', return: '12-18%' }
            ].map(portfolio => (
              <button
                key={portfolio.id}
                onClick={() => setSettings({...settings, portfolio: portfolio.id})}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  settings.portfolio === portfolio.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <h4 className="font-medium">{portfolio.name}</h4>
                <p className="text-sm text-gray-600">{portfolio.risk}</p>
                <p className="text-sm text-green-600">{portfolio.return}</p>
              </button>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
