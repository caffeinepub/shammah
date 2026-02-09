import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Sparkles, Users } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';

export default function LandingPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-emerald-800 tracking-tight">SHAMMAH</h1>
              <p className="text-xs text-emerald-600">Your Wellness Companion</p>
            </div>
          </div>
          <Button 
            onClick={login}
            disabled={isLoggingIn}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isLoggingIn ? 'Connecting...' : 'Sign In'}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              Your Personal Well-being Companion
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Holistic Health Support for Your Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              SHAMMAH is an agentic AI assistant designed to support individuals managing stigmatizing health conditions with compassion, privacy, and personalized care.
            </p>
            
            {/* Login Card */}
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-800">Get Started</CardTitle>
                <CardDescription>Sign in securely to begin your wellness journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base"
                >
                  {isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </span>
                  ) : (
                    'Sign In with Internet Identity'
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 border-gray-300"
                  disabled
                >
                  <SiGoogle className="mr-2 h-5 w-5" />
                  Google (Coming Soon)
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-gray-300"
                  disabled
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.4 24H0V8.6h4.8v10.6h6.6V24zm12.6 0h-11.4V8.6h4.8v10.6h6.6V24zm0-13.4h-11.4V0h11.4v10.6z"/>
                  </svg>
                  Microsoft (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <img 
              src="/assets/generated/wellness-hero.dim_800x400.jpg" 
              alt="Wellness Journey" 
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Private & Secure</p>
                  <p className="text-sm text-gray-600">Decentralized on Internet Computer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-emerald-800">7 Wellness Pillars</CardTitle>
              <CardDescription>
                Comprehensive support across physical, emotional, social, financial, leisure, personal growth, and spiritual dimensions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-emerald-800">Agentic AI Assistant</CardTitle>
              <CardDescription>
                Proactive wellness management with personalized task suggestions and activity tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-emerald-800">SCINS Support</CardTitle>
              <CardDescription>
                Specialized care for managing scars, cancers, inflammation, neuropathy, and sexual infections
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="flex items-center justify-center gap-2">
            © {new Date().getFullYear()}. Built with <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
