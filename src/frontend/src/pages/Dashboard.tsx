import { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Users, DollarSign, Smile, TrendingUp, Sparkles, BookOpen, Brain, LogOut, Award, Library } from 'lucide-react';
import OverviewPage from './dashboard/OverviewPage';
import JournalPage from './dashboard/JournalPage';
import MindfulnessPage from './dashboard/MindfulnessPage';
import PillarPage from './dashboard/PillarPage';
import RewardsPage from './dashboard/RewardsPage';
import ResourcesPage from './dashboard/ResourcesPage';

type Page = 'overview' | 'journal' | 'mindfulness' | 'rewards' | 'resources' | 'physical' | 'emotional' | 'social' | 'financial' | 'leisure' | 'growth' | 'spiritual';

const pillars = [
  { id: 'physical', name: 'Physical Care', icon: Heart, color: 'text-rose-600' },
  { id: 'emotional', name: 'Emotional Resilience', icon: Brain, color: 'text-purple-600' },
  { id: 'social', name: 'Social Connection', icon: Users, color: 'text-blue-600' },
  { id: 'financial', name: 'Financial Health', icon: DollarSign, color: 'text-green-600' },
  { id: 'leisure', name: 'Leisure & Fun', icon: Smile, color: 'text-yellow-600' },
  { id: 'growth', name: 'Personal Growth', icon: TrendingUp, color: 'text-indigo-600' },
  { id: 'spiritual', name: 'Spiritual Meaning', icon: Sparkles, color: 'text-amber-600' },
];

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const { data: userProfile } = useGetCallerUserProfile();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'journal':
        return <JournalPage />;
      case 'mindfulness':
        return <MindfulnessPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'physical':
      case 'emotional':
      case 'social':
      case 'financial':
      case 'leisure':
      case 'growth':
      case 'spiritual':
        const pillar = pillars.find(p => p.id === currentPage);
        return pillar ? <PillarPage pillar={pillar} /> : <OverviewPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <Sidebar className="border-r border-emerald-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-emerald-100 p-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/shammah-logo-transparent.dim_200x200.png" 
                alt="SHAMMAH" 
                className="w-10 h-10"
              />
              <div>
                <h2 className="font-bold text-emerald-800">SHAMMAH</h2>
                <p className="text-xs text-gray-600">{userProfile?.username || 'User'}</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentPage('overview')}
                  isActive={currentPage === 'overview'}
                  className="data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800"
                >
                  <Activity className="w-4 h-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentPage('rewards')}
                  isActive={currentPage === 'rewards'}
                  className="data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800"
                >
                  <Award className="w-4 h-4" />
                  <span>Rewards</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <div className="my-4 px-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Wellness Pillars
                </p>
              </div>

              {pillars.map((pillar) => (
                <SidebarMenuItem key={pillar.id}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentPage(pillar.id as Page)}
                    isActive={currentPage === pillar.id}
                    className="data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800"
                  >
                    <pillar.icon className={`w-4 h-4 ${pillar.color}`} />
                    <span>{pillar.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <div className="my-4 px-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Tools
                </p>
              </div>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentPage('journal')}
                  isActive={currentPage === 'journal'}
                  className="data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Journal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentPage('mindfulness')}
                  isActive={currentPage === 'mindfulness'}
                  className="data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800"
                >
                  <Brain className="w-4 h-4" />
                  <span>Mindfulness</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setCurrentPage('resources')}
                  isActive={currentPage === 'resources'}
                  className="data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800"
                >
                  <Library className="w-4 h-4" />
                  <span>Resources</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <div className="mt-auto border-t border-emerald-100 p-4">
            <Button 
              variant="outline" 
              className="w-full border-emerald-200 hover:bg-emerald-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-emerald-700" />
              <div className="flex-1" />
            </div>
          </header>

          <main className="p-6">
            {renderPage()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
