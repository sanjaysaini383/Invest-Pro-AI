'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { portfolioAPI, investmentAPI, gamificationAPI } from '@/lib/api';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface Portfolio {
  _id: string;
  totalBalance: number;
  gainLoss: number;
  performanceScore: number;
  holdings: any[];
}

interface Investment {
  _id: string;
  name: string;
  sector: string;
  expectedReturn: number;
  risk: string;
  price: number;
  change: number;
  esgScore?: number;
}

interface UserStats {
  totalPoints: number;
  rank: number;
  streak: number;
  level: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data concurrently
      const [portfolioRes, investmentsRes, statsRes] = await Promise.allSettled([
        portfolioAPI.getPortfolio(),
        investmentAPI.getSuggestions({ limit: 6 }),
        gamificationAPI.getUserStats()
      ]);

      // Handle portfolio data
      if (portfolioRes.status === 'fulfilled') {
        setPortfolio(portfolioRes.value.data.portfolio || {
          _id: 'default',
          totalBalance: 0,
          gainLoss: 0,
          performanceScore: 0,
          holdings: []
        });
      }

      // Handle investments data
      if (investmentsRes.status === 'fulfilled') {
        setInvestments(investmentsRes.value.data.suggestions || []);
      }

      // Handle user stats data
      if (statsRes.status === 'fulfilled') {
        setUserStats(statsRes.value.data.stats || {
          totalPoints: 0,
          rank: 0,
          streak: 0,
          level: 1
        });
      }

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.email}! 👋
          </h1>
          <p className="text-gray-600">Here's your investment overview for today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
            <button
              onClick={fetchDashboardData}
              className="ml-4 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolio?.totalBalance || 0)}
                </p>
                <p className={`text-sm ${portfolio?.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatChange(portfolio?.gainLoss || 0)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Growth</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{((portfolio?.totalBalance || 0) / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Investment Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolio?.performanceScore || 85}/100
                </p>
                <p className="text-sm text-gray-500">Based on recent activity</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolio?.holdings?.length || 0}
                </p>
                <p className="text-sm text-gray-500">Portfolios</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Investment Recommendations */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">AI Investment Recommendations</h2>
                <Link href="/suggestions">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.slice(0, 4).map((investment) => (
                  <div key={investment._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{investment.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        investment.change >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {formatChange(investment.change)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{investment.sector}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">{formatCurrency(investment.price)}</span>
                      <Button size="sm">Invest</Button>
                    </div>
                  </div>
                ))}
              </div>

              {investments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No investment recommendations available</p>
                  <Button onClick={fetchDashboardData}>Refresh</Button>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Investment Suggestions */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Investment Suggestions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get AI-powered investment recommendations
              </p>
              <Link href="/suggestions">
                <Button className="w-full">Explore Suggestions</Button>
              </Link>
            </Card>

            {/* Round-Up Investing */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Round-Up Investing</h3>
              <p className="text-sm text-gray-600 mb-4">
                Invest spare change automatically
              </p>
              <Link href="/roundup">
                <Button variant="outline" className="w-full">Setup Round-Up</Button>
              </Link>
            </Card>

            {/* Portfolio Performance */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center mb-4">
                <span className="text-gray-500">Portfolio chart will be displayed here</span>
              </div>
              <Link href="/portfolio">
                <Button variant="outline" className="w-full">View Portfolio</Button>
              </Link>
            </Card>

            {/* Investment Challenges */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Investment Challenges</h3>
              <p className="text-sm text-gray-600 mb-4">
                Level up your investing game
              </p>
              {userStats && (
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span className="font-medium">{userStats.totalPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span className="font-medium">#{userStats.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Streak:</span>
                    <span className="font-medium">{userStats.streak} days</span>
                  </div>
                </div>
              )}
              <Link href="/challenges">
                <Button variant="outline" className="w-full">View Challenges</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
