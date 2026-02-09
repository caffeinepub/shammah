import { useState } from 'react';
import { useGetCallerUserProfile, useAddMindfulnessActivity } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Plus, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const activityTypes = [
  'Meditation',
  'Deep Breathing',
  'Yoga',
  'Body Scan',
  'Mindful Walking',
  'Gratitude Practice',
  'Visualization',
  'Progressive Relaxation',
];

export default function MindfulnessPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const addMindfulnessActivity = useAddMindfulnessActivity();
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!activityType || !duration) return;

    await addMindfulnessActivity.mutateAsync({
      activityType,
      duration: parseInt(duration),
    });
    setActivityType('');
    setDuration('');
    setIsDialogOpen(false);
  };

  const totalMinutes = userProfile?.mindfulnessActivities.reduce((sum, a) => sum + Number(a.duration), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
            <Brain className="w-8 h-8" />
            Mindfulness Tracking
          </h1>
          <p className="text-gray-600">Log your meditation and mindfulness practices</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-emerald-800">Log Mindfulness Activity</DialogTitle>
              <DialogDescription>
                Record your meditation or mindfulness practice
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity-type">Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger id="activity-type" className="border-emerald-200">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="e.g., 15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-emerald-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!activityType || !duration || addMindfulnessActivity.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {addMindfulnessActivity.isPending ? 'Saving...' : 'Log Activity'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardDescription>Total Activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">
              {userProfile?.mindfulnessActivities.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardDescription>Total Minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">{totalMinutes}</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardDescription>Average Duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">
              {userProfile?.mindfulnessActivities.length 
                ? Math.round(totalMinutes / userProfile.mindfulnessActivities.length)
                : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">minutes</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity List */}
      {userProfile?.mindfulnessActivities.length === 0 ? (
        <Card className="border-emerald-200">
          <CardContent className="py-12 text-center">
            <img 
              src="/assets/generated/mindfulness-illustration.dim_300x300.png" 
              alt="Mindfulness" 
              className="w-32 h-32 mx-auto mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No activities logged yet</h3>
            <p className="text-gray-500 mb-6">Start your mindfulness journey today</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Activity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userProfile?.mindfulnessActivities.slice().reverse().map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between border-l-4 border-purple-300 pl-4 py-3 bg-purple-50/50 rounded-r-lg">
                  <div>
                    <p className="font-medium text-gray-800">{activity.activityType}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(Number(activity.timestamp) / 1000000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Number(activity.duration)} min
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
