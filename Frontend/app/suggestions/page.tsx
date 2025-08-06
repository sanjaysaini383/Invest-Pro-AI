'use client';

import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { investmentAPI, portfolioAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

interface Investment {
  _id: string;
  name: string;
  sector: string;
  expectedReturn: number;
  esgScore: number;
  risk: 'Low' | 'Medium' | 'High';
  price: number;
  change: number;
  description?: string;
  minInvestment?: number;
}

export default function SuggestionsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('All');
  const [selectedESGFilter, setSelectedESGFilter] = useState('All');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investing, setInvesting] = useState(false);

  const riskFilters = ['All', 'Low', 'Medium', 'High'];
  const industryFilters = ['All', 'Technology', 'Healthcare', 'Renewable Energy', 'Infrastructure', 'Finance'];
  const esgFilters = ['All', 'High (80+)', 'Medium (60-79)', 'Low (<60)'];

  useEffect(() => {
    fetchSuggestions();
  }, [selectedRiskFilter, selectedIndustryFilter, selectedESGFilter]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const filters = {
        risk: selectedRiskFilter !== 'All' ? selectedRiskFilter.toLowerCase() : undefined,
        industry: selectedIndustryFilter !== 'All' ? selectedIndustryFilter : undefined,
        esg: selectedESGFilter !== 'All' ? selectedESGFilter : undefined
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const response = await investmentAPI.getSuggestions(filters);
      
      if (response.data.success) {
        setInvestments(response.data.suggestions || []);
      } else {
        console.error('Failed to fetch suggestions:', response.data.message);
        setInvestments([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowInvestModal(true);
    setInvestmentAmount(investment.minInvestment?.toString() || '1000');
  };

  const confirmInvestment = async () => {
    if (!selectedInvestment || !investmentAmount) return;

    try {
      setInvesting(true);
      const response = await portfolioAPI.addInvestment({
        investmentId: selectedInvestment._id,
        amount: parseFloat(investmentAmount),
        investmentType: 'direct'
      });

      if (response.data.success) {
        setShowInvestModal(false);
        setSelectedInvestment(null);
        setInvestmentAmount('');
        alert(`Successfully invested ₹${investmentAmount} in ${selectedInvestment?.name}!`);
      } else {
        throw new Error(response.data.message || 'Investment failed');
      }
    } catch (error) {
      console.error('Investment error:', error);
      alert('Failed to process investment. Please try again.');
    } finally {
      setInvesting(false);
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const riskMatch = selectedRiskFilter === 'All' || investment.risk.toLowerCase() === selectedRiskFilter.toLowerCase();
    const industryMatch = selectedIndustryFilter === 'All' || investment.sector.includes(selectedIndustryFilter);
    
    let esgMatch = true;
    if (selectedESGFilter === 'High (80+)') esgMatch = investment.esgScore >= 80;
    else if (selectedESGFilter === 'Medium (60-79)') esgMatch = investment.esgScore >= 60 && investment.esgScore < 80;
    else if (selectedESGFilter === 'Low (<60)') esgMatch = investment.esgScore < 60;
    
    return riskMatch && industryMatch && esgMatch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getESGBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Investment Suggestions</h1>
          <p className="text-gray-600">Personalized investment recommendations based on your profile</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                value={selectedRiskFilter}
                onChange={(e) => setSelectedRiskFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {riskFilters.map((filter) => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={selectedIndustryFilter}
                onChange={(e) => setSelectedIndustryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {industryFilters.map((filter) => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>

            {/* ESG Score Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ESG Score</label>
              <select
                value={selectedESGFilter}
                onChange={(e) => setSelectedESGFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {esgFilters.map((filter) => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Investment Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map((investment) => (
              <Card key={investment._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{investment.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    investment.change >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {investment.change >= 0 ? '+' : ''}{investment.change.toFixed(2)}%
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{investment.sector}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="font-medium">{formatCurrency(investment.price)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Expected Return:</span>
                    <span className="font-medium text-green-600">{investment.expectedReturn}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Risk Level:</span>
                    <span className={`px-2 py-1 text-xs rounded ${getRiskBadgeColor(investment.risk)}`}>
                      {investment.risk}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">ESG Score:</span>
                    <span className={`px-2 py-1 text-xs rounded ${getESGBadgeColor(investment.esgScore)}`}>
                      {investment.esgScore}/100
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleInvest(investment)}
                  className="w-full"
                  disabled={investing}
                >
                  Invest Now
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredInvestments.length === 0 && (
          <Card className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investments found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more options</p>
            <Button onClick={fetchSuggestions}>Refresh Suggestions</Button>
          </Card>
        )}
      </main>

      {/* Investment Modal */}
      {showInvestModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Invest in {selectedInvestment.name}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount"
                  min={selectedInvestment.minInvestment || 1000}
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Investment:</span>
                  <span>{formatCurrency(parseFloat(investmentAmount) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expected Annual Return:</span>
                  <span className="text-green-600">{selectedInvestment.expectedReturn}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInvestModal(false);
                  setSelectedInvestment(null);
                  setInvestmentAmount('');
                }}
                disabled={investing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmInvestment}
                disabled={investing || !investmentAmount || parseFloat(investmentAmount) < (selectedInvestment.minInvestment || 1000)}
                className="flex-1"
              >
                {investing ? 'Investing...' : 'Confirm Investment'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
