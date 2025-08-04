// app/challenges/page.tsx
'use client';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { challengesAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    totalPoints: 2480,
    rank: 4,
    streak: 12
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallengesData();
  }, []);

  const fetchChallengesData = async () => {
    try {
      const [challengesRes, badgesRes, leaderboardRes] = await Promise.all([
        challengesAPI.getAll(),
        challengesAPI.getBadges(),
        challengesAPI.getLeaderboard()
      ]);

      setChallenges(challengesRes.data.challenges || [
        {
          id: 1,
          title: 'Weekly Saver',
          description: 'Invest ₹1000 this week',
          progress: 75,
          target: 1000,
          current: 750,
          reward: '50 points'
        },
        {
          id: 2,
          title: 'Green Investor',
          description: 'Invest in 3 ESG funds',
          progress: 66,
          target: 3,
          current: 2,
          reward: '100 points'
        }
      ]);

      setBadges(badgesRes.data.badges || [
        { id: 1, name: 'First Investment', icon: 'ri-medal-fill', earned: true },
        { id: 2, name: 'Green Champion', icon: 'ri-leaf-fill', earned: true },
        { id: 3, name: 'Consistent Saver', icon: 'ri-calendar-check-fill', earned: true },
        { id: 4, name: 'Risk Taker', icon: 'ri-rocket-fill', earned: false },
        { id: 5, name: 'Goal Achiever', icon: 'ri-trophy-fill', earned: false },
        { id: 6, name: 'Tech Investor', icon: 'ri-computer-fill', earned: false }
      ]);

      setLeaderboard(leaderboardRes.data.leaderboard || [
        { rank: 1, username: 'GreenInvestor92', points: 2850 },
        { rank: 2, username: 'SmartSaver45', points: 2720 },
        { rank: 3, username: 'EcoWarrior', points: 2650 },
        { rank: 4, username: 'YoungInvestor', points: 2480 },
        { rank: 5, username: 'WiseOwl88', points: 2350 }
      ]);
    } catch (error) {
      console.error('Error fetching challenges data:', error);
    } finally {
      setLoading(false);
    }
  };

  const participateInChallenge = async (challengeId) => {
    try {
      await challengesAPI.participate(challengeId);
      alert('Successfully joined the challenge!');
      fetchChallengesData(); // Refresh data
    } catch (error) {
      console.error('Error participating in challenge:', error);
      alert('Failed to join challenge. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
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

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{userStats.totalPoints.toLocaleString()}</div>
            <div className="text-gray-600">Total Points</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">#{userStats.rank}</div>
            <div className="text-gray-600">Rank</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{userStats.streak}</div>
            <div className="text-gray-600">Day Streak</div>
          </Card>
        </div>

        {/* Active Challenges */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Active Challenges</h3>
          <p className="text-gray-600 mb-6">Complete challenges to earn points and badges</p>
          
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <p className="text-gray-600 text-sm">{challenge.description}</p>
                    <p className="text-green-600 text-sm font-medium">{challenge.reward}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => participateInChallenge(challenge.id)}
                  >
                    Join
                  </Button>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {typeof challenge.current === 'number' && typeof challenge.target === 'number' 
                        ? `${challenge.current}/${challenge.target}` 
                        : `${challenge.progress}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Badge Collection */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Badge Collection</h3>
          <p className="text-gray-600 mb-6">
            Unlock achievements as you invest • {badges.filter(badge => badge.earned).length} of {badges.length} earned
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  badge.earned ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <i className={`${badge.icon} text-2xl ${
                    badge.earned ? 'text-yellow-600' : 'text-gray-400'
                  }`}></i>
                </div>
                <p className={`text-sm font-medium ${
                  badge.earned ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.name}
                </p>
                {badge.earned && (
                  <p className="text-xs text-green-600 font-medium">Earned!</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Leaderboard */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <span className="font-bold text-lg w-8">#{user.rank}</span>
                  <span className="font-medium">{user.username}</span>
                  {user.username === 'YoungInvestor' && (
                    <span className="ml-2 text-sm text-blue-600 font-medium">(You)</span>
                  )}
                </div>
                <span className="font-semibold">{user.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
