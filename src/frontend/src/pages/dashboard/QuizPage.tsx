import { useState } from 'react';
import { useGetCallerUserProfile, useSaveQuizResponse } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function QuizPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const saveQuizResponse = useSaveQuizResponse();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const answeredQuestions = userProfile?.quizResponses.map(r => r.questionId) || [];
  const allQuestionsAnswered = quizQuestions.every(q => answeredQuestions.includes(q.id));

  const handleNext = async () => {
    const answer = answers[question.id];
    if (!answer) return;

    await saveQuizResponse.mutateAsync({
      questionId: question.id,
      answer,
    });

    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswers({});
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers({});
    }
  };

  if (allQuestionsAnswered) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-emerald-800">Quiz Completed!</CardTitle>
            <CardDescription>
              Thank you for sharing your health journey with us. Your responses help us personalize your wellness experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-semibold text-emerald-800 mb-2">Your Responses:</h3>
                <div className="space-y-3">
                  {userProfile?.quizResponses.map((response) => {
                    const q = quizQuestions.find(qu => qu.id === response.questionId);
                    return (
                      <div key={response.questionId} className="text-sm">
                        <p className="font-medium text-gray-700">{q?.question}</p>
                        <p className="text-gray-600 mt-1">{response.answer}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button 
                onClick={() => setCurrentQuestion(0)}
                variant="outline"
                className="w-full border-emerald-300"
              >
                Review Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          Health & Wellness Quiz
        </h1>
        <p className="text-gray-600">Help us understand your journey to provide personalized support</p>
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete
            </span>
          </div>
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

          <div className="flex gap-3">
            {currentQuestion > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 border-emerald-300"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!answers[question.id] || saveQuizResponse.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saveQuizResponse.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : isLastQuestion ? (
                'Complete Quiz'
              ) : (
                'Next Question'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
