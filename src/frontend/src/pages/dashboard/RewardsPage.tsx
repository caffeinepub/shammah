import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Trophy, Gift, CheckCircle2, Lock } from 'lucide-react';

export default function RewardsPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  if (!userProfile) return null;

  const achievedBadges = userProfile.badges.filter(b => b.achieved);
  const inProgressBadges = userProfile.badges.filter(b => !b.achieved);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
          <Award className="w-8 h-8 text-amber-500" />
          Rewards & Achievements
        </h1>
        <p className="text-gray-600">Track your progress and unlock premium content</p>
      </div>

      {/* Points Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Total Points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-700">{Number(userProfile.points)}</div>
            <p className="text-sm text-gray-600 mt-2">Keep logging activities to earn more!</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              Badges Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-700">{achievedBadges.length}</div>
            <p className="text-sm text-gray-600 mt-2">Out of {userProfile.badges.length} total badges</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-500" />
              Rewards Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-700">{userProfile.rewards.length}</div>
            <p className="text-sm text-gray-600 mt-2">Activity rewards collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Your Badges
          </CardTitle>
          <CardDescription>Achievements unlocked through consistent wellness practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Achieved Badges */}
            {achievedBadges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Achieved
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievedBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-green-200 bg-green-50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{badge.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {badge.pointsNeeded.toString()} points
                          </Badge>
                          {badge.achievedTimestamp && (
                            <span className="text-xs text-gray-500">
                              {new Date(Number(badge.achievedTimestamp) / 1000000).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* In Progress Badges */}
            {inProgressBadges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  In Progress
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {inProgressBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{badge.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-700">
                              {Number(userProfile.points)} / {badge.pointsNeeded.toString()} points
                            </span>
                          </div>
                          <Progress 
                            value={(Number(userProfile.points) / Number(badge.pointsNeeded)) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Rewards */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Recent Rewards
          </CardTitle>
          <CardDescription>Points earned from your wellness activities</CardDescription>
        </CardHeader>
        <CardContent>
          {userProfile.rewards.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No rewards yet. Start logging activities to earn points!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userProfile.rewards.slice(-10).reverse().map((reward, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{reward.rewardType}</h4>
                        <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 ml-2">
                        {reward.source}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(Number(reward.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Tips Section */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Premium Wellness Tips
          </CardTitle>
          <CardDescription>Unlock exclusive content as you earn points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-200">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Advanced Skincare Routine Guide</p>
                <p className="text-xs text-gray-600">Unlocked at 100 points</p>
              </div>
              {Number(userProfile.points) >= 100 && (
                <Badge className="bg-green-100 text-green-700">Unlocked</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-200">
              {Number(userProfile.points) >= 200 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Personalized Nutrition Plan</p>
                <p className="text-xs text-gray-600">Unlocked at 200 points</p>
              </div>
              {Number(userProfile.points) >= 200 && (
                <Badge className="bg-green-100 text-green-700">Unlocked</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-amber-200">
              {Number(userProfile.points) >= 400 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Expert Wellness Consultation</p>
                <p className="text-xs text-gray-600">Unlocked at 400 points</p>
              </div>
              {Number(userProfile.points) >= 400 && (
                <Badge className="bg-green-100 text-green-700">Unlocked</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Element */}
      <div className="text-center">
        <img 
          src="/assets/generated/reward-badges.dim_400x200.png" 
          alt="Rewards" 
          className="w-64 h-32 mx-auto opacity-80"
        />
      </div>
    </div>
  );
}
