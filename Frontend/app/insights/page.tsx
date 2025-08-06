'use client';

import Header from '@/components/Header';
import Card from '@/components/ui/Card';
// import { mockUser, mockSpendingPattern, mockBehavioralTags } from '@/lib/mockData';

export default function InsightsPage() {
  const totalSpending = mockSpendingPattern.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Behavior & Personality Insights</h1>
          <p className="text-gray-600">Understanding your investment patterns and financial behavior</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-user-star-fill text-blue-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Investor Personality</h3>
                <p className="text-gray-600">Based on your investment behavior</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{mockUser.profileType}</h4>
              <p className="text-gray-600 mb-4">
                You prefer a balanced approach to investing, mixing growth opportunities with stable returns. 
                You're methodical in your decisions and value long-term financial security.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">7.5</div>
                  <div className="text-xs text-gray-600">Risk Tolerance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">8.2</div>
                  <div className="text-xs text-gray-600">Consistency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">9.1</div>
                  <div className="text-xs text-gray-600">ESG Focus</div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Behavioral Tags</h5>
              <div className="flex flex-wrap gap-2">
                {mockBehavioralTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <i className="ri-pie-chart-fill text-purple-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Spending Pattern Analysis</h3>
                <p className="text-gray-600">Your monthly expense breakdown</p>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="ri-donut-chart-fill text-purple-600 w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-900">₹{totalSpending.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Spending</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {mockSpendingPattern.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{category.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {((category.amount / totalSpending) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-trend-up-fill text-green-600 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">Investment Frequency</h4>
            <p className="text-center text-gray-600 mb-4">You invest regularly every 2-3 weeks</p>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">16</span>
              <span className="text-gray-500 ml-1">investments/month</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-check-fill text-blue-600 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">Risk Assessment</h4>
            <p className="text-center text-gray-600 mb-4">Moderate risk tolerance with ESG preference</p>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">65%</span>
              <span className="text-gray-500 ml-1">safe investments</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-target-fill text-yellow-600 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 text-center mb-2">Goal Progress</h4>
            <p className="text-center text-gray-600 mb-4">On track to reach your savings target</p>
            <div className="text-center">
              <span className="text-2xl font-bold text-yellow-600">65%</span>
              <span className="text-gray-500 ml-1">goal achieved</span>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}