'use client';

import { useState, useEffect } from 'react';
import { gamificationAPI } from '@/lib/api';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  reward: string;
  type: 'daily' | 'weekly' | 'monthly';
  current?: number;
  target?: number;
  progress?: number;
  status: 'active' | 'completed' | 'available';
  expiresAt: string;
}

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalPoints: number;
  rank: number;
  streak: number;
  level: number;
}

interface LeaderboardEntry {
  _id: string;
  username: string;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export default function ChallengesPage() {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchChallengesData();
  }, []);

  const fetchChallengesData = async () => {
    try {
      setLoading(true);
      
      const [challengesRes, badgesRes, statsRes, leaderboardRes] = await Promise.allSettled([
        gamificationAPI.getActiveChallenges(),
        gamificationAPI.getBadges(),
        gamificationAPI.getUserStats(),
        gamificationAPI.getLeaderboard()
      ]);

      // Handle challenges
      if (challengesRes.status === 'fulfilled') {
        setActiveChallenges(challengesRes.value.data.challenges || []);
      }

      // Handle badges
      if (badgesRes.status === 'fulfilled') {
        setBadges(badgesRes.value.data.badges || []);
      }

      // Handle user stats
      if (statsRes.status === 'fulfilled') {
        setUserStats(statsRes.value.data.stats || {
          totalPoints: 0,
          rank: 0,
          streak: 0,
          level: 1
        });
      }

      // Handle leaderboard
      if (leaderboardRes.status === 'fulfilled') {
        setLeaderboard(leaderboardRes.value.data.leaderboard || []);
      }

    } catch (error) {
      console.error('Error fetching challenges data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      setJoinLoading(challengeId);
      
      const response = await gamificationAPI.joinChallenge(challengeId);
      
      if (response.data.success) {
        // Refresh challenges data
        fetchChallengesData();
      } else {
        alert('Failed to join challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Failed to join challenge');
    } finally {
      setJoinLoading(null);
    }
  };

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Challenges</h1>
          <p className="text-gray-600">Level up your investing game with fun challenges and rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Challenges */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Active Challenges</h2>
                <Button onClick={fetchChallengesData} size="sm" variant="outline">
                  Refresh
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">Complete challenges to earn points and badges</p>
              
              <div className="space-y-4">
                {activeChallenges.map((challenge) => (
                  <div key={challenge._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">{challenge.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${getChallengeTypeColor(challenge.type)}`}>
                            {challenge.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                        <p className="text-sm font-medium text-indigo-600">{challenge.reward}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-2">{formatTimeLeft(challenge.expiresAt)}</p>
                        {challenge.status === 'available' && (
                          <Button
                            size="sm"
                            onClick={() => handleJoinChallenge(challenge._id)}
                            disabled={joinLoading === challenge._id}
                          >
                            {joinLoading === challenge._id ? 'Joining...' : 'Join'}
                          </Button>
                        )}
                        {challenge.status === 'completed' && (
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                            Completed ✓
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {challenge.current !== undefined && challenge.target !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{challenge.current}/{challenge.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {challenge.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(challenge.progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {activeChallenges.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No active challenges available</p>
                    <Button onClick={fetchChallengesData}>Refresh</Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Badge Collection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Badge Collection</h2>
              <p className="text-gray-600 mb-4">
                Unlock achievements as you invest • {badges.filter(badge => badge.earned).length} of {badges.length} earned
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge._id}
                    className={`border-2 rounded-lg p-4 text-center transition-all ${
                      badge.earned 
                        ? `${getBadgeRarityColor(badge.rarity)} opacity-100` 
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    {badge.earned && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          Earned!
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
              
              {userStats && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {userStats.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Points</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      #{userStats.rank}
                    </div>
                    <div className="text-sm text-gray-500">Rank</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {userStats.streak}
                    </div>
                    <div className="text-sm text-gray-500">Streak</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {userStats.level}
                    </div>
                    <div className="text-sm text-gray-500">Level</div>
                  </div>
                </div>
              )}
            </Card>

            {/* Leaderboard */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Leaderboard</h3>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center justify-between p-2 rounded ${
                      user.isCurrentUser ? 'bg-indigo-50 border border-indigo-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">
                        #{user.rank}
                      </span>
                      <span className="text-sm text-gray-700">
                        {user.username}
                        {user.isCurrentUser && (
                          <span className="ml-1 text-xs text-indigo-600">(You)</span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              {leaderboard.length === 0 && (
                <p className="text-center text-gray-500 py-4">No leaderboard data available</p>
              )}
            </Card>

            {/* Coming Soon */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Coming Soon</h3>
              <p className="text-sm text-gray-600 mb-4">New challenges launching next week!</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Tournament Mode</div>
                <div>• Team Challenges</div>
                <div>• Premium Rewards</div>
                <div>• Social Features</div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
