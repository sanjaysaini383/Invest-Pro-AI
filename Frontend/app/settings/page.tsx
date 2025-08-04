'use client';

import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { mockUser } from '@/lib/mockData';
import { useState } from 'react';

export default function SettingsPage() {
  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  const [roundUpAmount, setRoundUpAmount] = useState('5');
  const [savingsGoal, setSavingsGoal] = useState(mockUser.savingsGoal);
  
  const goalProgress = (mockUser.currentSavings / savingsGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Round-Up Settings</h1>
          <p className="text-gray-600">Customize your spare change investing preferences</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Round-Up Investing</h3>
                <p className="text-gray-600">
                  Automatically invest your spare change from everyday purchases
                </p>
              </div>
              <button
                onClick={() => setRoundUpEnabled(!roundUpEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  roundUpEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    roundUpEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {roundUpEnabled && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Round up to nearest:</h4>
                <div className="flex space-x-4">
                  {['1', '5', '10'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setRoundUpAmount(amount)}
                      className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                        roundUpAmount === amount
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-lightbulb-fill text-blue-600 w-4 h-4 flex items-center justify-center"></i>
                    </div>
                    <h5 className="font-semibold text-blue-900">Example</h5>
                  </div>
                  <p className="text-blue-800 text-sm">
                    If you spend ₹{237}, we'll round up to ₹{240} and invest the ₹{3} difference in your selected portfolio.
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-target-fill text-green-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Savings Goal Tracker</h3>
                <p className="text-gray-600">Set and track your investment targets</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Goal Progress</span>
                <span className="text-sm text-gray-600">
                  ₹{mockUser.currentSavings.toLocaleString()} / ₹{savingsGoal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-sm font-medium text-green-600">
                  {goalProgress.toFixed(1)}% Complete
                </span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Savings Goal (₹)
              </label>
              <input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter your savings goal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ₹{(savingsGoal - mockUser.currentSavings).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.ceil((savingsGoal - mockUser.currentSavings) / 5000)}
                </div>
                <div className="text-xs text-gray-600">Months to goal</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">₹5,000</div>
                <div className="text-xs text-gray-600">Monthly target</div>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              Update Goal
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Round-Up Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-coins-fill text-blue-600 w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹2,450</div>
                <div className="text-sm text-gray-600">Total Round-ups</div>
                <div className="text-xs text-green-600 mt-1">This month</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-shopping-cart-fill text-green-600 w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">127</div>
                <div className="text-sm text-gray-600">Transactions</div>
                <div className="text-xs text-green-600 mt-1">This month</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-trophy-fill text-purple-600 w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹19</div>
                <div className="text-sm text-gray-600">Avg Round-up</div>
                <div className="text-xs text-green-600 mt-1">Per transaction</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}