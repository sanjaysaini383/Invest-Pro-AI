// app/suggestions/page.tsx
'use client';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { investmentAPI, portfolioAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function SuggestionsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('All');
  const [selectedESGFilter, setSelectedESGFilter] = useState('All');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const riskFilters = ['All', 'Low', 'Medium', 'High'];
  const industryFilters = ['All', 'Technology', 'Healthcare', 'Renewable Energy', 'Infrastructure'];
  const esgFilters = ['All', 'High (80+)', 'Medium (60-79)', 'Low (<60)'];

  useEffect(() => {
    fetchSuggestions();
  }, [selectedRiskFilter, selectedIndustryFilter, selectedESGFilter]);

  const fetchSuggestions = async () => {
    try {
      const filters = {
        risk: selectedRiskFilter !== 'All' ? selectedRiskFilter : null,
        industry: selectedIndustryFilter !== 'All' ? selectedIndustryFilter : null,
        esg: selectedESGFilter !== 'All' ? selectedESGFilter : null
      };

      const response = await investmentAPI.getSuggestions(filters);
      setInvestments(response.data.suggestions || [
        {
          id: 1,
          name: 'Green Energy Fund',
          sector: 'Renewable Energy',
          expectedReturn: 12.5,
          esgScore: 95,
          risk: 'Low',
          price: 2450.80,
          change: 2.3
        },
        {
          id: 2,
          name: 'Tech Growth ETF',
          sector: 'Technology',
          expectedReturn: 18.2,
          esgScore: 78,
          risk: 'High',
          price: 4890.20,
          change: -1.2
        }
      ]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Use fallback data
      setInvestments([
        {
          id: 1,
          name: 'Green Energy Fund',
          sector: 'Renewable Energy',
          expectedReturn: 12.5,
          esgScore: 95,
          risk: 'Low',
          price: 2450.80,
          change: 2.3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (investment) => {
    setSelectedInvestment(investment);
    setShowInvestModal(true);
  };

  const confirmInvestment = async () => {
    try {
      await portfolioAPI.addInvestment({
        investmentId: selectedInvestment.id,
        amount: parseFloat(investmentAmount)
      });
      
      setShowInvestModal(false);
      setSelectedInvestment(null);
      setInvestmentAmount('');
      
      alert(`Successfully invested ₹${investmentAmount} in ${selectedInvestment?.name}!`);
    } catch (error) {
      console.error('Investment error:', error);
      alert('Failed to process investment. Please try again.');
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const riskMatch = selectedRiskFilter === 'All' || investment.risk === selectedRiskFilter;
    const industryMatch = selectedIndustryFilter === 'All' || investment.sector.includes(selectedIndustryFilter);
    
    let esgMatch = true;
    if (selectedESGFilter === 'High (80+)') esgMatch = investment.esgScore >= 80;
    else if (selectedESGFilter === 'Medium (60-79)') esgMatch = investment.esgScore >= 60 && investment.esgScore < 80;
    else if (selectedESGFilter === 'Low (<60)') esgMatch = investment.esgScore < 60;
    
    return riskMatch && industryMatch && esgMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Investment Suggestions</h1>
          <p className="text-gray-600">Personalized investment recommendations based on your profile</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedRiskFilter}
                onChange={(e) => setSelectedRiskFilter(e.target.value)}
              >
                {riskFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedIndustryFilter}
                onChange={(e) => setSelectedIndustryFilter(e.target.value)}
              >
                {industryFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ESG Score</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedESGFilter}
                onChange={(e) => setSelectedESGFilter(e.target.value)}
              >
                {esgFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Investment Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInvestments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map((investment) => (
              <Card key={investment.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{investment.name}</h3>
                    <p className="text-gray-600">{investment.sector}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    investment.risk === 'Low' ? 'bg-green-100 text-green-800' :
                    investment.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {investment.risk}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-medium">{investment.expectedReturn}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ESG Score:</span>
                    <span className="font-medium">{investment.esgScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">₹{investment.price}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleInvest(investment)}
                >
                  Invest Now
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <i className="ri-search-line text-4xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">No investments found</h3>
              <p>Try adjusting your filters to see more options</p>
            </div>
          </Card>
        )}

        {/* Investment Modal */}
        {showInvestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Invest in {selectedInvestment?.name}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowInvestModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmInvestment}
                  className="flex-1"
                  disabled={!investmentAmount}
                >
                  Confirm Investment
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
