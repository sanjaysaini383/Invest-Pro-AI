'use client';

import { useState, useEffect } from 'react';
import { roundupAPI } from '@/lib/api';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface RoundupSettings {
  isEnabled: boolean;
  roundUpTo: number;
  targetPortfolio: string;
  minimumRoundUp: number;
  maximumDaily: number;
  autoInvest: boolean;
}

interface SavingsGoal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  isActive: boolean;
}

interface Transaction {
  _id: string;
  amount: number;
  roundUpAmount: number;
  merchant: string;
  date: string;
  category: string;
}

export default function RoundupPage() {
  const [settings, setSettings] = useState<RoundupSettings>({
    isEnabled: false,
    roundUpTo: 10,
    targetPortfolio: 'main',
    minimumRoundUp: 1,
    maximumDaily: 100,
    autoInvest: true
  });
  
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    targetDate: ''
  });

  useEffect(() => {
    fetchRoundupData();
  }, []);

  const fetchRoundupData = async () => {
    try {
      setLoading(true);
      
      const [settingsRes, goalsRes, transactionsRes] = await Promise.allSettled([
        roundupAPI.getSettings(),
        roundupAPI.getSavingsGoals(),
        roundupAPI.getTransactions()
      ]);

      // Handle settings
      if (settingsRes.status === 'fulfilled') {
        setSettings(settingsRes.value.data.settings || settings);
      }

      // Handle savings goals
      if (goalsRes.status === 'fulfilled') {
        setSavingsGoals(goalsRes.value.data.goals || []);
      }

      // Handle transactions
      if (transactionsRes.status === 'fulfilled') {
        setRecentTransactions(transactionsRes.value.data.transactions || []);
      }

    } catch (error) {
      console.error('Error fetching roundup data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (key: keyof RoundupSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const response = await roundupAPI.updateSettings(settings);
      
      if (response.data.success) {
        alert('Settings saved successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const goalData = {
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        targetDate: newGoal.targetDate,
        isActive: true
      };

      const response = await roundupAPI.createSavingsGoal(goalData);
      
      if (response.data.success) {
        setShowAddGoal(false);
        setNewGoal({ name: '', targetAmount: '', targetDate: '' });
        fetchRoundupData(); // Refresh data
      } else {
        throw new Error(response.data.message || 'Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create savings goal. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const exampleSpend = 237;
  const exampleRoundUp = settings.roundUpTo - (exampleSpend % settings.roundUpTo);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Round-Up Settings</h1>
          <p className="text-gray-600">Customize your spare change investing preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Round-Up Configuration */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Round-Up Investing</h2>
              <p className="text-gray-600 mb-6">
                Automatically invest your spare change from everyday purchases
              </p>
              
              <div className="space-y-6">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable Round-Up</h3>
                    <p className="text-sm text-gray-600">Turn on automatic round-up investing</p>
                  </div>
                  <button
                    onClick={() => handleSettingsChange('isEnabled', !settings.isEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      settings.isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Round Up To */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Round up to nearest:</h3>
                  <select
                    value={settings.roundUpTo}
                    onChange={(e) => handleSettingsChange('roundUpTo', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={!settings.isEnabled}
                  >
                    <option value={5}>₹5</option>
                    <option value={10}>₹10</option>
                    <option value={20}>₹20</option>
                    <option value={50}>₹50</option>
                    <option value={100}>₹100</option>
                  </select>
                </div>

                {/* Example */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Example</h4>
                  <p className="text-sm text-gray-600">
                    If you spend ₹{exampleSpend}, we'll round up to ₹{exampleSpend + exampleRoundUp} and invest the ₹{exampleRoundUp} difference in your selected portfolio.
                  </p>
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Advanced Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Round-Up Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.minimumRoundUp}
                        onChange={(e) => handleSettingsChange('minimumRoundUp', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!settings.isEnabled}
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Daily Investment (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.maximumDaily}
                        onChange={(e) => handleSettingsChange('maximumDaily', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!settings.isEnabled}
                        min="10"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Auto-Invest</h4>
                        <p className="text-sm text-gray-600">Automatically invest round-ups</p>
                      </div>
                      <button
                        onClick={() => handleSettingsChange('autoInvest', !settings.autoInvest)}
                        disabled={!settings.isEnabled}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          settings.autoInvest && settings.isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                        } ${!settings.isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.autoInvest && settings.isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={saveSettings}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Round-Ups</h2>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.merchant}</p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-indigo-600">
                        +{formatCurrency(transaction.roundUpAmount)} invested
                      </p>
                    </div>
                  </div>
                ))}
                
                {recentTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No round-up transactions yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Enable round-up investing to start saving automatically
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Savings Goals */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Savings Goal Tracker</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddGoal(true)}
                >
                  Add Goal
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Set and track your investment targets</p>
              
              <div className="space-y-4">
                {savingsGoals.map((goal) => (
                  <div key={goal._id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      {goal.isActive && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Target date: {formatDate(goal.targetDate)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {savingsGoals.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No savings goals set</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Monthly Summary */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Round-ups</span>
                  <span className="font-medium">
                    {formatCurrency(
                      recentTransactions.reduce((sum, t) => sum + t.roundUpAmount, 0)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transactions</span>
                  <span className="font-medium">{recentTransactions.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Round-up</span>
                  <span className="font-medium">
                    {formatCurrency(
                      recentTransactions.length > 0
                        ? recentTransactions.reduce((sum, t) => sum + t.roundUpAmount, 0) / recentTransactions.length
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Savings Goal</h3>
            
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="50000"
                  min="1000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddGoal(false);
                    setNewGoal({ name: '', targetAmount: '', targetDate: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Goal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
