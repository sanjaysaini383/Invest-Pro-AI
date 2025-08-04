'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { portfolioAPI, investmentAPI } from '@/lib/api';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      const [portfolioRes, investmentsRes] = await Promise.all([
        portfolioAPI.getPortfolio(),
        investmentAPI.getAll()
      ]);
      
      setPortfolio(portfolioRes.data || {
        totalBalance: 125000,
        gainLoss: 2.5,
        performanceScore: 85
      });
      
      setInvestments(investmentsRes.data?.slice(0, 3) || [
        { id: 1, name: 'Green Energy Fund', sector: 'Renewable Energy', return: '+12.5%' },
        { id: 2, name: 'Tech Growth ETF', sector: 'Technology', return: '+8.2%' },
        { id: 3, name: 'Healthcare Fund', sector: 'Healthcare', return: '+15.1%' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use fallback data
      setPortfolio({
        totalBalance: 125000,
        gainLoss: 2.5,
        performanceScore: 85
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.email}! 👋
          </h1>
          <p className="text-gray-600">Here's your investment overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Balance</h3>
            <p className="text-2xl font-bold">₹{portfolio?.totalBalance?.toLocaleString() || '0'}</p>
            <p className={`text-sm ${portfolio?.gainLoss >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {portfolio?.gainLoss >= 0 ? '+' : ''}{portfolio?.gainLoss}%
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Portfolio Growth</h3>
            <p className="text-2xl font-bold text-gray-900">
              +{((portfolio?.totalBalance - 100000) / 1000).toFixed(1)}K
            </p>
            <p className="text-sm text-gray-500">This month</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Investment Score</h3>
            <p className="text-2xl font-bold text-gray-900">{portfolio?.performanceScore || 85}/100</p>
            <p className="text-sm text-gray-500">Based on recent activity</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Active Investments</h3>
            <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
            <p className="text-sm text-gray-500">Portfolios</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Investment Recommendations</h3>
            {investments.slice(0, 2).map((investment, index) => (
              <div key={investment.id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium text-gray-900">{investment.name}</p>
                  <p className="text-sm text-gray-600">{investment.sector}</p>
                </div>
                <span className="text-green-600 font-medium">{investment.return}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => router.push('/suggestions')}>
              View All Suggestions
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Suggestions</h3>
            <p className="text-gray-600 mb-4">Get AI-powered investment recommendations</p>
            <Button variant="primary" size="sm" className="w-full" onClick={() => router.push('/suggestions')}>
              <i className="ri-lightbulb-line mr-2"></i>
              Get Suggestions
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Round-Up Investing</h3>
            <p className="text-gray-600 mb-4">Invest spare change automatically</p>
            <Button variant="secondary" size="sm" className="w-full" onClick={() => router.push('/roundup')}>
              <i className="ri-coins-line mr-2"></i>
              Setup Round-Up
            </Button>
          </Card>
        </div>

        {/* Portfolio Performance Chart Placeholder */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <i className="ri-line-chart-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">Portfolio chart will be displayed here</p>
            </div>
          </div>
        </Card>

        {/* Investment Challenges */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Challenges</h3>
          <p className="text-gray-600 mb-4">Level up your investing game</p>
          <Button variant="outline" size="sm" onClick={() => router.push('/challenges')}>
            <i className="ri-trophy-line mr-2"></i>
            View Challenges
          </Button>
        </Card>
      </main>
    </div>
  );
}
