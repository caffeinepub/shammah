import { useGetCallerUserProfile, useManageRewards } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { LucideIcon, Plus, Calendar, Utensils, Dumbbell, Moon, Pill, Cigarette, Wine, Camera, Music, Heart, Users, DollarSign, Smile, BookOpen, Target, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MedicationManagement from '../../components/MedicationManagement';
import DebtManagement from '../../components/DebtManagement';

interface PillarPageProps {
  pillar: {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
  };
}

export default function PillarPage({ pillar }: PillarPageProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const manageRewards = useManageRewards();
  const [activityLog, setActivityLog] = useState('');
  const [reflection, setReflection] = useState('');

  // Physical Care toggles
  const [drugMonitoring, setDrugMonitoring] = useState(false);
  const [smokeMonitoring, setSmokeMonitoring] = useState(false);
  const [alcoholMonitoring, setAlcoholMonitoring] = useState(false);

  const currentPillar = userProfile?.wellnessPillars.find(p => p.name === pillar.name);
  const currentProgress = Number(currentPillar?.progress || 0);

  const handleLogActivity = async () => {
    if (!activityLog.trim()) return;

    const activityScore = 10;
    const reflectionScore = reflection.trim() ? 5 : 0;
    const categoryScore = activityScore + reflectionScore;

    await manageRewards.mutateAsync({
      category: pillar.name,
      activityScore,
      reflectionScore,
      categoryScore,
      categoryDescription: activityLog + (reflection ? ` | Reflection: ${reflection}` : ''),
    });

    setActivityLog('');
    setReflection('');
  };

  const renderPillarContent = () => {
    switch (pillar.id) {
      case 'physical':
        return (
          <div className="space-y-6">
            {/* Medication Management */}
            <MedicationManagement />

            {/* Trackers */}
            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle className="text-rose-700 flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Daily Trackers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Utensils className="w-6 h-6 text-rose-600" />
                    <span className="text-sm">Log Meal</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Dumbbell className="w-6 h-6 text-rose-600" />
                    <span className="text-sm">Log Exercise</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Moon className="w-6 h-6 text-rose-600" />
                    <span className="text-sm">Log Sleep</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                    <Heart className="w-6 h-6 text-rose-600" />
                    <span className="text-sm">Skincare Routine</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Toggles */}
            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle className="text-rose-700">Health Monitoring</CardTitle>
                <CardDescription>Track substances that may affect your wellness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Pill className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="drug-monitoring">Drug Monitoring</Label>
                  </div>
                  <Switch id="drug-monitoring" checked={drugMonitoring} onCheckedChange={setDrugMonitoring} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cigarette className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="smoke-monitoring">Smoke Monitoring</Label>
                  </div>
                  <Switch id="smoke-monitoring" checked={smokeMonitoring} onCheckedChange={setSmokeMonitoring} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wine className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="alcohol-monitoring">Alcohol Monitoring</Label>
                  </div>
                  <Switch id="alcohol-monitoring" checked={alcoholMonitoring} onCheckedChange={setAlcoholMonitoring} />
                </div>
              </CardContent>
            </Card>

            {/* AI Generated Content */}
            <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-rose-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI-Generated Weekly Meal Plan
                </CardTitle>
                <CardDescription>Personalized nutrition recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Monday:</strong> Grilled salmon with quinoa and steamed vegetables</p>
                  <p><strong>Tuesday:</strong> Chicken stir-fry with brown rice and mixed greens</p>
                  <p><strong>Wednesday:</strong> Lentil soup with whole grain bread and side salad</p>
                  <p><strong>Thursday:</strong> Baked cod with sweet potato and broccoli</p>
                  <p><strong>Friday:</strong> Turkey wrap with avocado and fresh fruit</p>
                  <Badge className="mt-3 bg-rose-100 text-rose-700">AI Generated</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Photo Log Reminder */}
            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle className="text-rose-700 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Symptom Photo Log
                </CardTitle>
                <CardDescription>Track visual progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Progress Photo
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">Reminder: Weekly photo recommended</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'emotional':
        return (
          <div className="space-y-6">
            {/* Guided Meditation */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Guided Meditation
                </CardTitle>
                <CardDescription>Audio sessions for emotional wellness</CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="/assets/generated/meditation-audio-visual.dim_300x100.png" 
                  alt="Meditation" 
                  className="w-full h-24 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Morning Calm (10 min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Stress Relief (15 min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Evening Relaxation (20 min)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Journal */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">Mood Journal</CardTitle>
                <CardDescription>Track your emotional state daily</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 justify-center">
                  {['😊', '😌', '😐', '😔', '😢'].map((emoji, idx) => (
                    <button
                      key={idx}
                      className="text-4xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-purple-50"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Affirmation Generator */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Daily Affirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center text-gray-700 italic mb-4">
                  "I am worthy of love, care, and healing. Every day, I grow stronger and more resilient."
                </p>
                <Button variant="outline" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate New Affirmation
                </Button>
                <Badge className="mt-3 bg-purple-100 text-purple-700">AI Generated</Badge>
              </CardContent>
            </Card>

            {/* AI Mood Analysis */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Mood Pattern Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Based on your recent entries, you've shown improvement in emotional resilience. Consider trying evening meditation for better sleep quality.
                </p>
                <Badge className="bg-purple-100 text-purple-700">AI Insight</Badge>
              </CardContent>
            </Card>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Support Groups
                </CardTitle>
                <CardDescription>Connect with others on similar journeys</CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="/assets/generated/social-network.dim_350x250.png" 
                  alt="Social Network" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">SCINS Support Circle</p>
                      <p className="text-xs text-gray-600">124 members</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Wellness Warriors</p>
                      <p className="text-xs text-gray-600">89 members</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Social Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Virtual Coffee Chat</p>
                    <p className="text-xs text-gray-600">Tomorrow at 3 PM</p>
                  </div>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Wellness Workshop</p>
                    <p className="text-xs text-gray-600">Friday at 6 PM</p>
                  </div>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Connection Reminder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  It's been 3 days since you connected with your support network. Consider reaching out to a friend or family member today!
                </p>
                <Badge className="mt-3 bg-blue-100 text-blue-700">AI Suggestion</Badge>
              </CardContent>
            </Card>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            {/* Debt Management */}
            <DebtManagement />

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Budget Tracker
                </CardTitle>
                <CardDescription>Manage healthcare expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <img 
                  src="/assets/generated/budget-tracker.dim_350x250.png" 
                  alt="Budget Tracker" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Monthly Budget</span>
                    <span className="font-semibold text-gray-800">$500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Spent This Month</span>
                    <span className="font-semibold text-green-700">$320</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Affordable Care Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 border border-green-200 rounded-lg">
                  <p className="font-medium text-gray-800">Insurance Coverage Guide</p>
                  <p className="text-xs text-gray-600 mt-1">Understanding your benefits</p>
                </div>
                <div className="p-3 border border-green-200 rounded-lg">
                  <p className="font-medium text-gray-800">Financial Assistance Programs</p>
                  <p className="text-xs text-gray-600 mt-1">Available support options</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Local Discounts Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-2">
                  Based on your location, we found 3 pharmacies offering discounts on skincare products.
                </p>
                <Badge className="bg-green-100 text-green-700">AI Scan Result</Badge>
              </CardContent>
            </Card>
          </div>
        );

      case 'leisure':
        return (
          <div className="space-y-6">
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-700 flex items-center gap-2">
                  <Smile className="w-5 h-5" />
                  Hobby Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src="/assets/generated/hobby-cards.dim_400x300.png" 
                  alt="Hobbies" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-16">
                    <Music className="w-4 h-4 mr-2" />
                    Music
                  </Button>
                  <Button variant="outline" className="h-16">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Reading
                  </Button>
                  <Button variant="outline" className="h-16">
                    <Camera className="w-4 h-4 mr-2" />
                    Photography
                  </Button>
                  <Button variant="outline" className="h-16">
                    <Heart className="w-4 h-4 mr-2" />
                    Crafts
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardHeader>
                <CardTitle className="text-yellow-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Personalized Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Based on your mood patterns, we've curated a relaxing playlist for you.
                </p>
                <Button variant="outline" className="w-full">
                  <Music className="w-4 h-4 mr-2" />
                  Listen Now
                </Button>
                <Badge className="mt-3 bg-yellow-100 text-yellow-700">AI Curated</Badge>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-700">Local Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-gray-800">Art Exhibition</p>
                  <p className="text-xs text-gray-600">This weekend at City Gallery</p>
                </div>
                <div className="p-3 border border-yellow-200 rounded-lg">
                  <p className="font-medium text-gray-800">Outdoor Concert</p>
                  <p className="text-xs text-gray-600">Next Friday at Central Park</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'growth':
        return (
          <div className="space-y-6">
            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-700 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Goal Setting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src="/assets/generated/goal-progress.dim_300x200.png" 
                  alt="Goals" 
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <div className="space-y-3">
                  <Input placeholder="Enter a new goal..." />
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-700 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Educational Reading
                </CardTitle>
                <CardDescription>Learn about psychodermatology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 border border-indigo-200 rounded-lg">
                  <p className="font-medium text-gray-800">Mind-Skin Connection</p>
                  <p className="text-xs text-gray-600 mt-1">Understanding the relationship</p>
                </div>
                <div className="p-3 border border-indigo-200 rounded-lg">
                  <p className="font-medium text-gray-800">Stress and Skin Health</p>
                  <p className="text-xs text-gray-600 mt-1">Managing triggers effectively</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-indigo-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Growth Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Your personalized growth plan: Focus on stress management techniques this week, then explore nutritional education next month.
                </p>
                <Badge className="bg-indigo-100 text-indigo-700">AI Generated</Badge>
              </CardContent>
            </Card>

            <Card className="border-indigo-200">
              <CardHeader>
                <CardTitle className="text-indigo-700">Skill Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Take Self-Assessment Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'spiritual':
        return (
          <div className="space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Spiritual Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src="/assets/generated/spiritual-mandala.dim_200x200.png" 
                  alt="Spiritual" 
                  className="w-32 h-32 mx-auto mb-4"
                />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Daily Reflection Prompt
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Gratitude Practice
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Mindful Breathing
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-amber-700 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Daily Sacred Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center text-gray-700 italic mb-4">
                  "What am I grateful for today? How can I bring more meaning to my actions?"
                </p>
                <Badge className="bg-amber-100 text-amber-700">AI Generated</Badge>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">Volunteering Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 border border-amber-200 rounded-lg">
                  <p className="font-medium text-gray-800">Community Health Fair</p>
                  <p className="text-xs text-gray-600 mt-1">Help others on their wellness journey</p>
                </div>
                <div className="p-3 border border-amber-200 rounded-lg">
                  <p className="font-medium text-gray-800">Support Group Facilitator</p>
                  <p className="text-xs text-gray-600 mt-1">Share your experience and wisdom</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">Charitable Giving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">
                  Support organizations working to help others with similar conditions.
                </p>
                <Button variant="outline" className="w-full">
                  View Donation Options
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
          <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
          {pillar.name}
        </h1>
        <p className="text-gray-600">Progress: {currentProgress}%</p>
      </div>

      {/* Activity Logger */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-emerald-800 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Log Activity
          </CardTitle>
          <CardDescription>Earn points by tracking your wellness activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="activity">Activity Description</Label>
            <Textarea
              id="activity"
              placeholder="What did you do today for this wellness area?"
              value={activityLog}
              onChange={(e) => setActivityLog(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="reflection">Reflection (Optional - Earn bonus points!)</Label>
            <Textarea
              id="reflection"
              placeholder="How did this activity make you feel?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button
            onClick={handleLogActivity}
            disabled={!activityLog.trim() || manageRewards.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {manageRewards.isPending ? 'Logging...' : 'Log Activity & Earn Points'}
          </Button>
          <p className="text-xs text-center text-gray-600">
            Earn 10 points for activity + 5 bonus points for reflection
          </p>
        </CardContent>
      </Card>

      {/* Pillar-specific content */}
      {renderPillarContent()}
    </div>
  );
}
