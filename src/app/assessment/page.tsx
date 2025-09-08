'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { databaseService } from '@/lib/supabase';

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  response_scale: 0 | 1 | 2 | 3;
  minSelections?: number; // For questions that require multiple selections
  allowMultiple?: boolean; // Whether multiple selections are allowed
}

interface AssessmentResponse {
  question_id: string;
  response: (0 | 1 | 2 | 3) | (0 | 1 | 2 | 3)[]; // Single response or array for multiple selections
}

export default function AssessmentPage() {
  const { user, isLoading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sample assessment questions - in a real app, these would come from an API
  const questions: AssessmentQuestion[] = [
    // Physical Dimension
    { id: '1', category: 'physical', question: 'How would you rate your current energy levels throughout the day?', response_scale: 3 },
    { id: '2', category: 'physical', question: 'Which areas of physical health would you like to improve? (Select all that apply)', response_scale: 3, allowMultiple: true, minSelections: 2 },
    { id: '3', category: 'physical', question: 'How consistent are you with exercise and physical activity?', response_scale: 3 },
    { id: '4', category: 'physical', question: 'How would you rate your sleep quality and consistency?', response_scale: 3 },
    { id: '5', category: 'physical', question: 'How would you rate your nutrition and eating habits?', response_scale: 3 },
    { id: '6', category: 'physical', question: 'How would you rate your overall physical health and vitality?', response_scale: 3 },
    
    // Mental Dimension
    { id: '7', category: 'mental', question: 'How would you rate your ability to focus and concentrate?', response_scale: 3 },
    { id: '8', category: 'mental', question: 'How would you rate your stress management skills?', response_scale: 3 },
    { id: '9', category: 'mental', question: 'How would you rate your learning and personal development?', response_scale: 3 },
    { id: '10', category: 'mental', question: 'How would you rate your decision-making abilities?', response_scale: 3 },
    { id: '11', category: 'mental', question: 'How would you rate your mental clarity and cognitive function?', response_scale: 3 },
    
    // Spiritual Dimension
    { id: '12', category: 'spiritual', question: 'How would you rate your spiritual growth and development?', response_scale: 3 },
    { id: '13', category: 'spiritual', question: 'How consistent are you with prayer and spiritual practices?', response_scale: 3 },
    { id: '14', category: 'spiritual', question: 'How would you rate your sense of purpose and meaning?', response_scale: 3 },
    { id: '15', category: 'spiritual', question: 'How would you rate your connection to your faith community?', response_scale: 3 },
    { id: '16', category: 'spiritual', question: 'How would you rate your overall spiritual well-being?', response_scale: 3 },
    
    // Relational Dimension
    { id: '17', category: 'relational', question: 'How would you rate your relationships with family members?', response_scale: 3 },
    { id: '18', category: 'relational', question: 'How would you rate your friendships and social connections?', response_scale: 3 },
    { id: '19', category: 'relational', question: 'How would you rate your communication skills?', response_scale: 3 },
    { id: '20', category: 'relational', question: 'How would you rate your ability to resolve conflicts?', response_scale: 3 },
    { id: '21', category: 'relational', question: 'How would you rate your overall relational health?', response_scale: 3 },
    
    // Financial Dimension
    { id: '22', category: 'financial', question: 'How would you rate your financial planning and budgeting?', response_scale: 3 },
    { id: '23', category: 'financial', question: 'How would you rate your savings and investment habits?', response_scale: 3 },
    { id: '24', category: 'financial', question: 'How would you rate your debt management?', response_scale: 3 },
    { id: '25', category: 'financial', question: 'How would you rate your financial education and literacy?', response_scale: 3 },
    { id: '26', category: 'financial', question: 'How would you rate your overall financial health?', response_scale: 3 },
    
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/assessment');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);



  const handleResponse = (response: 0 | 1 | 2 | 3) => {
    const currentQuestion = questions[currentQuestionIndex];
    const existingResponseIndex = responses.findIndex(r => r.question_id === currentQuestion.id);
    
    if (currentQuestion.allowMultiple) {
      // Handle multiple selections
      const existingResponse = existingResponseIndex >= 0 ? responses[existingResponseIndex].response : [];
      const currentResponses = Array.isArray(existingResponse) ? existingResponse : [];
      
      let newResponses: (0 | 1 | 2 | 3)[];
      if (currentResponses.includes(response)) {
        // Remove if already selected
        newResponses = currentResponses.filter(r => r !== response);
      } else {
        // Add new selection
        newResponses = [...currentResponses, response];
      }
      
      if (existingResponseIndex >= 0) {
        // Update existing response
        const updatedResponses = [...responses];
        updatedResponses[existingResponseIndex].response = newResponses;
        setResponses(updatedResponses);
      } else {
        // Add new response
        setResponses([...responses, {
          question_id: currentQuestion.id,
          response: newResponses
        }]);
      }
    } else {
      // Handle single selection (radio button behavior)
      if (existingResponseIndex >= 0) {
        // Update existing response
        const updatedResponses = [...responses];
        updatedResponses[existingResponseIndex].response = response;
        setResponses(updatedResponses);
                           } else {
           // Add new response
           const newResponses = [...responses, {
             question_id: currentQuestion.id,
             response: response
           }];
           setResponses(newResponses);
         }
   }
 };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert('You must be logged in to submit the assessment.');
      return;
    }

    if (responses.length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Add a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.error('⏰ Assessment submission timed out after 30 seconds');
      setIsSubmitting(false);
      alert('Assessment submission timed out. Please try again.');
    }, 30000);
    
    try {
      console.log('🔄 Submitting assessment for user:', user.id);
      console.log('📊 Responses:', responses);
      
      // Calculate scores for each dimension
      const scores = calculateDimensionScores(responses);
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
      
      // Find strongest dimension and biggest opportunity
      const strongestDimension = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
      const biggestOpportunity = Object.entries(scores).reduce((a, b) => scores[a[0]] < scores[b[0]] ? a : b)[0];
      
      // Create assessment data
      const assessmentData = {
        user_id: user.id,
        completed_at: new Date().toISOString(),
        questions: questions,
        analysis: {
          physical: scores.physical,
          mental: scores.mental,
          spiritual: scores.spiritual,
          relational: scores.relational,
          financial: scores.financial
        },
        plan: {
          focus_areas: [strongestDimension, biggestOpportunity],
          recommendations: generateRecommendations(scores)
        },
        ascension_score: totalScore,
        strongest_dimension: strongestDimension,
        biggest_opportunity: biggestOpportunity
      };
      
      console.log('📊 Assessment data to save:', assessmentData);
      
      // Try to save to database (non-blocking)
      let savedAssessment = null;
      console.log('🔄 Attempting to save assessment to database...');
      console.log('📊 Assessment data structure:', JSON.stringify(assessmentData, null, 2));
      
      // Test database connection first
      console.log('🔍 Testing database connection...');
      try {
        const testConnection = await databaseService.getLifeAuditAssessment(user.id);
        console.log('✅ Database connection test successful');
      } catch (connError) {
        console.log('⚠️ Database connection test failed (this is expected for new users):', connError);
      }
      
      // Use Promise.race to prevent hanging
      const dbSavePromise = databaseService.saveLifeAuditAssessment(assessmentData);
      const dbTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timeout')), 15000)
      );
      
      try {
        console.log('⏱️ Starting database save with 15-second timeout...');
        savedAssessment = await Promise.race([dbSavePromise, dbTimeoutPromise]);
        console.log('✅ Assessment saved to database:', savedAssessment);
      } catch (dbError) {
        console.error('❌ Database save failed:', dbError);
        console.log('🔄 Continuing with local storage fallback...');
      }
      
      // Try to update user profile (non-blocking)
      console.log('🔄 Attempting to update user profile...');
      const profileUpdatePromise = databaseService.updateUserProfile(user.id, {
        assessment_completed: true
      });
      const profileTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile update timeout')), 5000)
      );
      
      try {
        await Promise.race([profileUpdatePromise, profileTimeoutPromise]);
        console.log('✅ User profile updated in database');
      } catch (profileError) {
        console.error('❌ Profile update failed:', profileError);
        console.log('🔄 Continuing with local update...');
      }
      
      // Update local user data regardless of database success
      console.log('🔄 Updating local user data...');
      console.log('📊 Scores to update:', {
        totalScore,
        physical: scores.physical,
        mental: scores.mental,
        spiritual: scores.spiritual,
        relational: scores.relational,
        financial: scores.financial
      });
      
      updateUserData({
        assessment_completed: true,
        totalScore: totalScore,
        physicalScore: scores.physical,
        mentalScore: scores.mental,
        spiritualScore: scores.spiritual,
        relationalScore: scores.relational,
        financialScore: scores.financial
      });
      
      console.log('✅ Assessment completed successfully');
      
      // Redirect to results page (use generated ID if database save failed)
      const assessmentId = savedAssessment?.id || `local-${Date.now()}`;
      console.log('🔄 Redirecting to results page with ID:', assessmentId);
      router.push(`/assessment/results?assessmentId=${assessmentId}`);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  const calculateDimensionScores = (responses: AssessmentResponse[]) => {
    const scores = {
      physical: 0,
      mental: 0,
      spiritual: 0,
      relational: 0,
      financial: 0
    };

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.question_id);
      if (question) {
        const responseValue = Array.isArray(response.response) 
          ? response.response.reduce((sum, val) => sum + val, 0) / response.response.length
          : response.response;
        
        scores[question.category as keyof typeof scores] += responseValue;
      }
    });

    return scores;
  };

  const generateRecommendations = (scores: any) => {
    const recommendations = [];
    
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score < 10) {
        recommendations.push(`Focus on improving your ${dimension} development`);
      } else if (score > 15) {
        recommendations.push(`Maintain your strength in ${dimension} development`);
      }
    });
    
    return recommendations;
  };

  const getCurrentResponse = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = responses.find(r => r.question_id === currentQuestion.id);
    
    return response ? response.response : null;
  };

  const canProceedToNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = getCurrentResponse();
    
    if (response === null || response === undefined) {
      return false;
    }
    
    if (currentQuestion.allowMultiple) {
      // For multiple selection questions, check if minimum selections are met
      const responseArray = Array.isArray(response) ? response : [];
      const minSelections = currentQuestion.minSelections || 1;
      return responseArray.length >= minSelections;
    } else {
      // For single selection questions, any response is valid (including 0)
      return true;
    }
  };

  const getAnsweredQuestionsCount = () => {
    let answeredCount = 0;
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const response = responses.find(r => r.question_id === question.id);
      
      if (response) {
        if (question.allowMultiple) {
          const responseArray = Array.isArray(response.response) ? response.response : [];
          const minSelections = question.minSelections || 1;
          if (responseArray.length >= minSelections) {
            answeredCount++;
          }
        } else {
          answeredCount++;
        }
      }
    }
    
    return answeredCount;
  };

  const canSubmitAssessment = () => {
    // Check if all questions are answered
    console.log('🔍 Checking if assessment can be submitted...');
    console.log('📊 Total questions:', questions.length);
    console.log('📊 Total responses:', responses.length);
    console.log('📊 Answered questions:', getAnsweredQuestionsCount());
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const response = responses.find(r => r.question_id === question.id);
      
      if (!response) {
        console.log(`❌ Question ${i + 1} (${question.id}) not answered`);
        return false;
      }
      
      if (question.allowMultiple) {
        const responseArray = Array.isArray(response.response) ? response.response : [];
        const minSelections = question.minSelections || 1;
        if (responseArray.length < minSelections) {
          console.log(`❌ Question ${i + 1} (${question.id}) needs ${minSelections} selections, has ${responseArray.length}`);
          return false;
        }
      }
    }
    
    console.log('✅ All questions answered - assessment can be submitted!');
    return true;
  };

  const getValidationMessage = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = getCurrentResponse();
    
    if (response === null || response === undefined) {
      return "Please select a response to continue";
    }
    
    if (currentQuestion.allowMultiple) {
      const responseArray = Array.isArray(response) ? response : [];
      const minSelections = currentQuestion.minSelections || 1;
      const currentSelections = responseArray.length;
      
      if (currentSelections < minSelections) {
        return `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''} (${currentSelections}/${minSelections})`;
      }
      
      return `Great! You've selected ${currentSelections} option${currentSelections > 1 ? 's' : ''}`;
    }
    
    return "Response selected - you can continue";
  };

  const getProgressPercentage = () => {
    return Math.round((responses.length / questions.length) * 100);
  };

  const getResponseOptions = (question: AssessmentQuestion) => {
    // For rating questions (like "How would you rate..."), use the standard scale
    if (question.question.toLowerCase().includes('how would you rate') || 
        question.question.toLowerCase().includes('how consistent are you') ||
        question.question.toLowerCase().includes('how would you rate your overall')) {
      return [
        { value: 0, label: 'Struggling', description: 'This area needs significant attention and improvement' },
        { value: 1, label: 'Developing', description: 'Making progress but still has room for growth' },
        { value: 2, label: 'Good', description: 'Doing well in this area with consistent habits' },
        { value: 3, label: 'Excellent', description: 'Thriving and excelling in this dimension' }
      ];
    }
    
    // For specific question types, provide contextual options
    switch (question.id) {
      case '2': // Which areas of physical health would you like to improve?
        return [
          { value: 0, label: 'Energy & Vitality', description: 'Improve daily energy levels and overall vitality' },
          { value: 1, label: 'Strength & Muscle', description: 'Build strength and increase muscle mass' },
          { value: 2, label: 'Cardiovascular Health', description: 'Improve heart health and endurance' },
          { value: 3, label: 'Flexibility & Mobility', description: 'Enhance flexibility and joint mobility' }
        ];
      
      case '7': // How would you rate your ability to focus and concentrate?
        return [
          { value: 0, label: 'Easily Distracted', description: 'Struggle to maintain focus for extended periods' },
          { value: 1, label: 'Sometimes Focused', description: 'Can focus but get distracted occasionally' },
          { value: 2, label: 'Generally Focused', description: 'Maintain good focus most of the time' },
          { value: 3, label: 'Highly Focused', description: 'Excellent concentration and deep focus ability' }
        ];
      
      case '8': // How would you rate your stress management skills?
        return [
          { value: 0, label: 'Overwhelmed', description: 'Often feel stressed and struggle to cope' },
          { value: 1, label: 'Learning to Cope', description: 'Working on stress management techniques' },
          { value: 2, label: 'Managing Well', description: 'Handle stress effectively most of the time' },
          { value: 3, label: 'Thriving Under Pressure', description: 'Excellent stress resilience and management' }
        ];
      
      case '12': // How would you rate your spiritual growth and development?
        return [
          { value: 0, label: 'Seeking Direction', description: 'Looking for spiritual guidance and purpose' },
          { value: 1, label: 'Growing Faith', description: 'Building spiritual foundation and practices' },
          { value: 2, label: 'Steady Growth', description: 'Consistent spiritual development and connection' },
          { value: 3, label: 'Deep Connection', description: 'Strong spiritual life and divine relationship' }
        ];
      
      case '17': // How would you rate your relationships with family members?
        return [
          { value: 0, label: 'Strained', description: 'Relationships need significant healing and work' },
          { value: 1, label: 'Improving', description: 'Working on building better family connections' },
          { value: 2, label: 'Good', description: 'Healthy and supportive family relationships' },
          { value: 3, label: 'Excellent', description: 'Strong, loving, and harmonious family bonds' }
        ];
      
      case '22': // How would you rate your financial planning and budgeting?
        return [
          { value: 0, label: 'No Plan', description: 'Living paycheck to paycheck without budgeting' },
          { value: 1, label: 'Basic Planning', description: 'Starting to track expenses and save' },
          { value: 2, label: 'Good Planning', description: 'Regular budgeting and financial goals' },
          { value: 3, label: 'Excellent Planning', description: 'Comprehensive financial strategy and wealth building' }
        ];
      
      case '27': // How would you rate your creative expression and hobbies?
        return [
          { value: 0, label: 'Seeking Inspiration', description: 'Looking for creative outlets and interests' },
          { value: 1, label: 'Exploring', description: 'Trying different creative activities and hobbies' },
          { value: 2, label: 'Regular Practice', description: 'Consistent creative expression and hobby time' },
          { value: 3, label: 'Highly Creative', description: 'Deep creative fulfillment and artistic expression' }
        ];
      
      case '32': // How would you rate your impact on others and community?
        return [
          { value: 0, label: 'Personal Focus', description: 'Currently focused on personal development' },
          { value: 1, label: 'Starting to Serve', description: 'Beginning to help others and contribute' },
          { value: 2, label: 'Active Contributor', description: 'Regularly serving and making positive impact' },
          { value: 3, label: 'Transformational Leader', description: 'Significantly impacting lives and communities' }
        ];
      
      default:
        // For other questions, use the standard rating scale
        return [
          { value: 0, label: 'Struggling', description: 'This area needs significant attention and improvement' },
          { value: 1, label: 'Developing', description: 'Making progress but still has room for growth' },
          { value: 2, label: 'Good', description: 'Doing well in this area with consistent habits' },
          { value: 3, label: 'Excellent', description: 'Thriving and excelling in this dimension' }
        ];
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      physical: 'from-green-500 to-emerald-500',
      mental: 'from-blue-500 to-cyan-500',
      spiritual: 'from-purple-500 to-pink-500',
      relational: 'from-yellow-500 to-orange-500',
      financial: 'from-indigo-500 to-blue-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-blue-200">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = getCurrentResponse();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
              ASCEND
            </Link>
            <div className="text-blue-200 text-sm">
              Welcome, {user.full_name}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-200 text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-blue-200 text-sm">
              {progressPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          {/* Category Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getCategoryColor(currentQuestion.category)}`}>
              {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)} Dimension
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

                     {/* Response Options */}
           <div className="space-y-4 mb-8">
             {getResponseOptions(currentQuestion).map((option) => {
               const isSelected = currentQuestion.allowMultiple 
                 ? Array.isArray(currentResponse) && currentResponse.includes(option.value)
                 : currentResponse === option.value;
               
               return (
                 <label
                   key={option.value}
                   className={`flex items-start space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                     isSelected
                       ? 'border-yellow-400 bg-yellow-400/10'
                       : 'border-white/20 hover:border-white/40'
                   }`}
                 >
                   <input
                     type={currentQuestion.allowMultiple ? "checkbox" : "radio"}
                     name={`response-${currentQuestion.id}`}
                     value={option.value}
                     checked={isSelected}
                     onChange={() => handleResponse(option.value as 0 | 1 | 2 | 3)}
                     className="w-5 h-5 text-yellow-400 bg-white/20 border-white/30 focus:ring-yellow-400 focus:ring-2"
                   />
                   <div className="flex-1">
                     <div className="text-white font-semibold text-lg mb-1">
                       {option.label}
                     </div>
                     <div className="text-blue-200 text-sm">
                       {option.description}
                     </div>
                   </div>
                   {isSelected && (
                     <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                   )}
                 </label>
               );
             })}
           </div>

                     {/* Validation Message */}
           <div className={`text-center p-4 rounded-lg mb-6 ${
             canProceedToNext() 
               ? 'bg-green-500/10 border border-green-400/30' 
               : 'bg-blue-500/10 border border-blue-400/30'
           }`}>
             <p className={`text-sm font-medium ${
               canProceedToNext() ? 'text-green-200' : 'text-blue-200'
             }`}>
               {getValidationMessage()}
             </p>
             

           </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-6 py-3 text-blue-200 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>

            <div className="flex flex-col items-center space-y-4">
              {currentQuestionIndex === questions.length - 1 && (
                <div className="text-center">
                  <div className="text-sm text-blue-200 mb-2">
                    Questions Answered: {getAnsweredQuestionsCount()} / {questions.length}
                  </div>
                  {!canSubmitAssessment() && (
                    <div className="text-xs text-red-300">
                      Please answer all questions to complete the assessment
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmitAssessment() || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center"
                  >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Assessment
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={goToNextQuestion}
                  disabled={!canProceedToNext()}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all transform flex items-center ${
                    canProceedToNext()
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 hover:scale-105'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </button>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <p className="text-blue-200 text-sm">
            Take your time to reflect on each question. Your honest responses will help create the most accurate assessment of your current life dimensions.
          </p>
        </div>
      </div>
    </div>
  );
}
