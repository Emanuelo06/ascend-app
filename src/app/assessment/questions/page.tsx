'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  Brain, 
  BookOpen, 
  Users, 
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { assessmentQuestions, AssessmentQuestion } from '@/data/assessment-questions';

interface AssessmentResponse {
  questionId: string;
  response: number;
}

export default function AssessmentQuestionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [user, router]);

  if (!user) return null;

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;
  const hasAnsweredCurrent = responses.some(r => r.questionId === currentQuestion.id);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Heart className="h-5 w-5 text-red-400" />;
      case 'mental': return <Brain className="h-5 w-5 text-blue-400" />;
      case 'spiritual': return <BookOpen className="h-5 w-5 text-purple-400" />;
      case 'relational': return <Users className="h-5 w-5 text-green-400" />;
      case 'financial': return <DollarSign className="h-5 w-5 text-yellow-400" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'from-red-400 to-red-600';
      case 'mental': return 'from-blue-400 to-blue-600';
      case 'spiritual': return 'from-purple-400 to-purple-600';
      case 'relational': return 'from-green-400 to-green-600';
      case 'financial': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleResponse = (response: number) => {
    const existingResponseIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    
    if (existingResponseIndex >= 0) {
      const newResponses = [...responses];
      newResponses[existingResponseIndex].response = response;
      setResponses(newResponses);
    } else {
      setResponses([...responses, { questionId: currentQuestion.id, response }]);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canProceed = hasAnsweredCurrent;
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1;

  const handleSubmitAssessment = async () => {
    if (responses.length !== assessmentQuestions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate scores for each dimension
      const scores: { [key: string]: number } = {};
      const categoryWeights: { [key: string]: number } = {};
      
      assessmentQuestions.forEach(q => {
        if (!scores[q.category]) {
          scores[q.category] = 0;
          categoryWeights[q.category] = 0;
        }
        
        const response = responses.find(r => r.questionId === q.id);
        if (response) {
          scores[q.category] += response.response * q.weight;
          categoryWeights[q.category] += q.weight;
        }
      });

      // Calculate percentage scores
      const finalScores: { [key: string]: number } = {};
      Object.keys(scores).forEach(category => {
        finalScores[category] = Math.round((scores[category] / categoryWeights[category]) * 20); // Convert to 0-100 scale
      });

      // Calculate total score
      const totalScore = Math.round(
        Object.values(finalScores).reduce((sum, score) => sum + score, 0) / Object.keys(finalScores).length
      );

      // Find strongest and weakest areas
      const sortedCategories = Object.entries(finalScores).sort(([,a], [,b]) => b - a);
      const strongestArea = sortedCategories[0][0];
      const biggestOpportunity = sortedCategories[sortedCategories.length - 1][0];

      // Determine improvement urgency
      let improvementUrgency = 'low';
      if (totalScore < 40) improvementUrgency = 'critical';
      else if (totalScore < 60) improvementUrgency = 'high';
      else if (totalScore < 80) improvementUrgency = 'medium';

      // Store results in localStorage for now (in real app, send to API)
      const assessmentResults = {
        userId: user.id,
        assessmentDate: new Date().toISOString(),
        physicalScore: finalScores.physical || 0,
        mentalScore: finalScores.mental || 0,
        spiritualScore: finalScores.spiritual || 0,
        relationalScore: finalScores.relational || 0,
        financialScore: finalScores.financial || 0,
        totalScore,
        strongestArea,
        biggestOpportunity,
        improvementUrgency,
        responses,
        timeSpent
      };

      localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
      
      // Update user data with assessment scores
      const userData = localStorage.getItem('ascend_user_data');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          totalScore: totalScore,
          physicalScore: finalScores.physical || 0,
          mentalScore: finalScores.mental || 0,
          spiritualScore: finalScores.spiritual || 0,
          relationalScore: finalScores.relational || 0,
          financialScore: finalScores.financial || 0,
          updated_at: new Date().toISOString()
        };
        
        // Update stored user data
        localStorage.setItem('ascend_user_data', JSON.stringify(updatedUser));
        
        // Update user in users list
        const storedUsers = localStorage.getItem('ascend_users') || '[]';
        const users = JSON.parse(storedUsers);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updatedUser };
          localStorage.setItem('ascend_users', JSON.stringify(users));
        }
      }
      
      // Redirect to results page
      router.push('/assessment/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/assessment/welcome')}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Life Assessment</h1>
              <p className="text-blue-200 text-sm">Question {currentQuestionIndex + 1} of {assessmentQuestions.length}</p>
            </div>
            <div className="text-blue-200 text-sm flex items-center space-x-2">
              <Clock size={16} />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm">Progress</span>
            <span className="text-blue-200 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          {/* Category Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${getCategoryColor(currentQuestion.category)}`}>
              {getCategoryIcon(currentQuestion.category)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white capitalize">
                {currentQuestion.category} Dimension
              </h2>
              <p className="text-blue-200 text-sm">Question {currentQuestion.questionNumber}</p>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
            {currentQuestion.questionText}
          </h3>

          {/* Context */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
            <p className="text-blue-200 text-sm italic">
              💡 {currentQuestion.context}
            </p>
          </div>

          {/* Response Options */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((value) => {
              const isSelected = responses.find(r => r.questionId === currentQuestion.id)?.response === value;
              const isAnswered = hasAnsweredCurrent;
              
              return (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/20 text-white'
                      : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">
                      {value === 1 && 'Strongly Disagree'}
                      {value === 2 && 'Disagree'}
                      {value === 3 && 'Neutral'}
                      {value === 4 && 'Agree'}
                      {value === 5 && 'Strongly Agree'}
                    </span>
                    {isSelected && (
                      <CheckCircle className="h-6 w-6 text-yellow-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5 mr-2 inline" />
            Previous
          </button>

          <div className="text-center">
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <BarChart3 size={16} />
              <span>
                {responses.length} of {assessmentQuestions.length} answered
              </span>
            </div>
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitAssessment}
              disabled={!canProceed || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Assessment
                  <ArrowRight className="h-5 w-5 ml-2 inline" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              disabled={!canProceed}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2 inline" />
            </button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-white/5 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Your Progress</h4>
          <div className="grid grid-cols-5 gap-2">
            {['physical', 'mental', 'spiritual', 'relational', 'financial'].map((category) => {
              const categoryQuestions = assessmentQuestions.filter(q => q.category === category);
              const answeredQuestions = responses.filter(r => 
                categoryQuestions.some(q => q.id === r.questionId)
              );
              const categoryProgress = (answeredQuestions.length / categoryQuestions.length) * 100;
              
              return (
                <div key={category} className="text-center">
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(category)} transition-all duration-500`}
                      style={{ width: `${categoryProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-200 text-xs capitalize">{category}</p>
                  <p className="text-white text-xs font-medium">{Math.round(categoryProgress)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
