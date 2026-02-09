import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Heart, TrendingUp } from 'lucide-react';

interface WelcomeTutorialProps {
  onClose: () => void;
}

export default function WelcomeTutorial({ onClose }: WelcomeTutorialProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/assets/generated/shammah-logo-transparent.dim_200x200.png" 
              alt="SHAMMAH" 
              className="w-20 h-20"
            />
          </div>
          <DialogTitle className="text-2xl text-center text-emerald-800">
            Welcome to SHAMMAH
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Your Agentic AI Personal Well-being Assistant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-gray-700 leading-relaxed">
              SHAMMAH is designed specifically for individuals managing <strong>stigmatizing health conditions</strong> (SCINS: scars, cancers, inflammation, neuropathy, sexual infections). We provide compassionate, private, and personalized support for your holistic wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Agentic AI Assistant</h3>
                <p className="text-sm text-gray-600">
                  Proactively manages wellness activities and provides personalized task suggestions
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Private & Secure</h3>
                <p className="text-sm text-gray-600">
                  Decentralized on the Internet Computer for maximum privacy and security
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">7 Wellness Pillars</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive support across physical, emotional, social, and more dimensions
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Track Progress</h3>
                <p className="text-sm text-gray-600">
                  Gamified scoring system and journaling to monitor your wellness journey
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-800 mb-2">Getting Started:</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-emerald-600">1.</span>
                <span>Complete the health quiz to help us understand your journey</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-emerald-600">2.</span>
                <span>Explore the 7 wellness pillars and track your progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-emerald-600">3.</span>
                <span>Use the journal and mindfulness tools to reflect and grow</span>
              </li>
            </ol>
          </div>
        </div>

        <Button 
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Let's Begin My Journey
        </Button>
      </DialogContent>
    </Dialog>
  );
}
