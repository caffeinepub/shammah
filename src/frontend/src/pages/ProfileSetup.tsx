import { useState } from 'react';
import { useCreateUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfileSetup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const createProfile = useCreateUserProfile();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;

    await createProfile.mutateAsync({ email, username });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/shammah-logo-transparent.dim_200x200.png" 
            alt="SHAMMAH Logo" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Welcome to SHAMMAH</h1>
          <p className="text-gray-600">Let's set up your wellness profile</p>
        </div>

        <Card className="border-emerald-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-emerald-800">Create Your Profile</CardTitle>
            <CardDescription>Tell us a bit about yourself to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Display Name</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="How should we call you?"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={createProfile.isPending}
              >
                {createProfile.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Profile...
                  </span>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
