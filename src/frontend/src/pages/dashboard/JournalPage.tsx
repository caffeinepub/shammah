import { useState } from 'react';
import { useGetCallerUserProfile, useAddJournalEntry } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function JournalPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const addJournalEntry = useAddJournalEntry();
  const [newEntry, setNewEntry] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    if (!newEntry.trim()) return;

    await addJournalEntry.mutateAsync(newEntry);
    setNewEntry('');
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            My Journal
          </h1>
          <p className="text-gray-600">Reflect on your wellness journey</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-emerald-800">New Journal Entry</DialogTitle>
              <DialogDescription>
                Write about your thoughts, feelings, and experiences
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind today?"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="min-h-64 border-emerald-200 focus:border-emerald-500"
              />
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
                  disabled={!newEntry.trim() || addJournalEntry.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {addJournalEntry.isPending ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {userProfile?.journalEntries.length === 0 ? (
        <Card className="border-emerald-200">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No journal entries yet</h3>
            <p className="text-gray-500 mb-6">Start documenting your wellness journey today</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userProfile?.journalEntries.slice().reverse().map((entry, idx) => (
            <Card key={idx} className="border-emerald-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardDescription>
                  {new Date(Number(entry.timestamp) / 1000000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
