import { useState } from 'react';
import { useSaveQuizResponse, useUploadProgressPhoto, useCompleteOnboarding } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Camera, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ExternalBlob } from '../backend';

const quizQuestions = [
  {
    id: 'condition',
    question: 'Which health condition(s) are you managing?',
    type: 'textarea' as const,
  },
  {
    id: 'duration',
    question: 'How long have you been managing this condition?',
    type: 'radio' as const,
    options: ['Less than 6 months', '6 months - 1 year', '1-3 years', 'More than 3 years'],
  },
  {
    id: 'goals',
    question: 'What are your primary wellness goals?',
    type: 'textarea' as const,
  },
  {
    id: 'challenges',
    question: 'What challenges do you face in managing your condition?',
    type: 'textarea' as const,
  },
  {
    id: 'support',
    question: 'What type of support would be most helpful?',
    type: 'radio' as const,
    options: ['Emotional support', 'Practical guidance', 'Community connection', 'All of the above'],
  },
];

type OnboardingStep = 'photo' | 'quiz' | 'complete';

export default function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>('photo');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const saveQuizResponse = useSaveQuizResponse();
  const uploadPhoto = useUploadProgressPhoto();
  const completeOnboarding = useCompleteOnboarding();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    const arrayBuffer = await photoFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array);

    await uploadPhoto.mutateAsync({
      photo: blob,
      description: 'Baseline progress photo',
      isBaseline: true,
    });

    setStep('quiz');
  };

  const handleQuizNext = async () => {
    const question = quizQuestions[currentQuestion];
    const answer = answers[question.id];
    if (!answer) return;

    await saveQuizResponse.mutateAsync({
      questionId: question.id,
      answer,
    });

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswers({});
    } else {
      setStep('complete');
    }
  };

  const handleComplete = async () => {
    await completeOnboarding.mutateAsync();
  };

  const totalSteps = 2; // Photo + Quiz
  const currentStepNumber = step === 'photo' ? 1 : step === 'quiz' ? 2 : 2;
  const progressPercentage = (currentStepNumber / totalSteps) * 100;

  if (step === 'photo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-emerald-800">Getting Started</h1>
              <span className="text-sm text-gray-600">Step 1 of {totalSteps}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Card className="border-emerald-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center gap-2">
                <Camera className="w-6 h-6" />
                Baseline Progress Photo
              </CardTitle>
              <CardDescription>
                Upload a photo to track your progress over time. This helps you visualize your wellness journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {photoPreview ? (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    className="w-full"
                  >
                    Choose Different Photo
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-12 text-center">
                  <Camera className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload your baseline photo</p>
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      Select Photo
                    </div>
                  </Label>
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              )}

              <Button
                onClick={handlePhotoUpload}
                disabled={!photoFile || uploadPhoto.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {uploadPhoto.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </span>
                ) : (
                  'Continue to Health Quiz'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const question = quizQuestions[currentQuestion];
    const quizProgress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Health & Wellness Quiz
              </h1>
              <span className="text-sm text-gray-600">Step 2 of {totalSteps}</span>
            </div>
            <Progress value={50 + (quizProgress / 2)} className="h-2 mb-2" />
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
          </div>

          <Card className="border-emerald-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-emerald-800">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {question.type === 'textarea' ? (
                <div className="space-y-2">
                  <Label htmlFor="answer">Your Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Share your thoughts..."
                    value={answers[question.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                    className="min-h-32 border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              ) : (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
                >
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2 border border-emerald-100 rounded-lg p-3 hover:bg-emerald-50 transition-colors">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <Button
                onClick={handleQuizNext}
                disabled={!answers[question.id] || saveQuizResponse.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saveQuizResponse.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : currentQuestion === quizQuestions.length - 1 ? (
                  'Complete Quiz'
                ) : (
                  'Next Question'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-emerald-800">Onboarding Complete!</CardTitle>
            <CardDescription>
              You're all set to begin your wellness journey with SHAMMAH
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleComplete}
              disabled={completeOnboarding.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {completeOnboarding.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </span>
              ) : (
                'Enter Dashboard'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
