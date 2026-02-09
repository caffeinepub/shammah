import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, BookOpen, Brain, TrendingUp, Calendar } from 'lucide-react';

export default function OverviewPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  if (!userProfile) return null;

  const totalProgress = userProfile.wellnessPillars.reduce((sum, p) => sum + Number(p.progress), 0) / userProfile.wellnessPillars.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Welcome back, {userProfile.username}!</h1>
        <p className="text-gray-600">Here's your wellness overview</p>
      </div>

      {/* Stats Grid - Removed skin health score, total points, and badges earned */}
      <div className="grid md:grid-cols-1 gap-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Overall Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">{Math.round(totalProgress)}%</div>
            <Progress value={totalProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Wellness Pillars */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Wellness Pillars Progress
          </CardTitle>
          <CardDescription>Track your progress across all seven dimensions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProfile.wellnessPillars.map((pillar) => (
            <div key={pillar.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{pillar.name}</span>
                <span className="text-sm text-gray-500">{Number(pillar.progress)}%</span>
              </div>
              <Progress value={Number(pillar.progress)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Recent Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile.journalEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">No journal entries yet. Start writing to track your journey!</p>
            ) : (
              <div className="space-y-3">
                {userProfile.journalEntries.slice(-3).reverse().map((entry, idx) => (
                  <div key={idx} className="border-l-2 border-emerald-300 pl-3 py-1">
                    <p className="text-sm text-gray-700 line-clamp-2">{entry.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(Number(entry.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Recent Mindfulness
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile.mindfulnessActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">No mindfulness activities yet. Start your practice today!</p>
            ) : (
              <div className="space-y-3">
                {userProfile.mindfulnessActivities.slice(-3).reverse().map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between border-l-2 border-purple-300 pl-3 py-1">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{activity.activityType}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Number(activity.timestamp) / 1000000).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{Number(activity.duration)} min</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Info */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Your experience is active for <strong>{Number(userProfile.usageDurationMonths)} months</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
