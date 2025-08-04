'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="ri-line-chart-line text-white"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">InvestPro</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Investing Made
            <span className="text-blue-600"> Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get AI-powered investment recommendations, track your portfolio, and grow your wealth with our intelligent platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <i className="ri-rocket-line mr-2"></i>
                Start Investing Today
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <i className="ri-login-circle-line mr-2"></i>
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-brain-line text-2xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Recommendations</h3>
            <p className="text-gray-600">Get personalized investment suggestions based on your goals and risk tolerance.</p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-pie-chart-line text-2xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Tracking</h3>
            <p className="text-gray-600">Monitor your investments in real-time with comprehensive analytics and insights.</p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-coins-line text-2xl text-purple-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Round-Up Investing</h3>
            <p className="text-gray-600">Automatically invest your spare change from everyday purchases.</p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of smart investors already using our platform</p>
            <Link href="/register">
              <Button variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
                <i className="ri-user-add-line mr-2"></i>
                Create Free Account
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
