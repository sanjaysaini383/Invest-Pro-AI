'use client';

import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
// import { mockChallenges, mockLeaderboard, mockBadges } from '@/lib/mockData';

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Challenges</h1>
          <p className="text-gray-600">Level up your investing game with fun challenges and rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-trophy-fill text-blue-600 w-6 h-6 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Active Challenges</h3>
                  <p className="text-gray-600">Complete challenges to earn points and badges</p>
                </div>
              </div>

              <div className="space-y-4">
                {mockChallenges.map((challenge) => (
                  <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{challenge.title}</h4>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        {challenge.reward}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {typeof challenge.current === 'number' && typeof challenge.target === 'number'
                            ? `${challenge.current}/${challenge.target}`
                            : `${challenge.progress}%`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button
                      variant={challenge.progress >= 100 ? 'secondary' : 'outline'}
                      size="sm"
                      disabled={challenge.progress >= 100}
                    >
                      {challenge.progress >= 100 ? 'Completed!' : 'Continue'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-award-fill text-purple-600 w-6 h-6 flex items-center justify-center"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Badge Collection</h3>
                    <p className="text-gray-600">Unlock achievements as you invest</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockBadges.filter(badge => badge.earned).length}
                  </div>
                  <div className="text-sm text-gray-600">of {mockBadges.length} earned</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`text-center p-4 rounded-lg border-2 ${
                      badge.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        badge.earned
                          ? 'bg-green-100'
                          : 'bg-gray-200'
                      }`}
                    >
                      <i
                        className={`${badge.icon} w-6 h-6 flex items-center justify-center ${
                          badge.earned
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      ></i>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        badge.earned
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {badge.name}
                    </div>
                    {badge.earned && (
                      <div className="text-xs text-green-600 mt-1">Earned!</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-star-fill text-yellow-600 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Stats</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">2,480</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">4</div>
                    <div className="text-xs text-gray-600">Rank</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">12</div>
                    <div className="text-xs text-gray-600">Streak</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-bar-chart-fill text-green-600 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
              </div>
              
              <div className="space-y-3">
                {mockLeaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {user.rank}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          user.username === 'YoungInvestor' ? 'text-blue-600' : 'text-gray-900'
                        }`}
                      >
                        {user.username}
                        {user.username === 'YoungInvestor' && (
                          <span className="text-xs text-blue-500 ml-1">(You)</span>
                        )}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.points.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-fire-fill text-red-600 w-5 h-5 flex items-center justify-center"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
              </div>
              
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-3">
                  New challenges launching next week!
                </p>
                <Button variant="outline" size="sm">
                  Get Notified
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}