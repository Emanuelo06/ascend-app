'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  HeartIcon, UtensilsIcon, TargetIcon, ClockIcon, 
  PlusIcon, ArrowRightIcon, CheckIcon, ZapIcon,
  TrendingUpIcon, CalendarIcon, BookOpenIcon
} from 'lucide-react';

interface NutritionPlan {
  id: string;
  type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'energy_boost' | 'recovery';
  dailyCalories: number;
  macronutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  hydrationGoal: number;
  supplements: string[];
  createdAt: string;
}

export default function NutritionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<NutritionPlan | null>(null);
  const [planType, setPlanType] = useState<string>('');
  const [mealTracking, setMealTracking] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const generateNutritionPlan = async () => {
    if (!user || !planType) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          planType,
          preferences: {
            dietaryRestrictions: [],
            allergies: [],
            preferredCuisines: ['mediterranean', 'asian', 'american'],
            mealPrepTime: '30_min',
            budget: 'moderate'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate nutrition plan');
      }

      const result = await response.json();
      setCurrentPlan(result.plan);
      
      // Store in localStorage
      localStorage.setItem(`nutritionPlan_${user.id}`, JSON.stringify(result.plan));
      
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      alert('There was an error generating your nutrition plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const trackMeal = (meal: keyof typeof mealTracking) => {
    setMealTracking(prev => ({
      ...prev,
      [meal]: !prev[meal]
    }));
  };

  const getPlanTypeInfo = (type: string) => {
    const types = {
      weight_loss: {
        title: 'Weight Loss',
        description: 'Calorie deficit with high protein',
        color: 'from-red-500 to-pink-500',
        icon: TrendingUpIcon
      },
      muscle_gain: {
        title: 'Muscle Gain',
        description: 'Calorie surplus with protein focus',
        color: 'from-blue-500 to-indigo-500',
        icon: ZapIcon
      },
      maintenance: {
        title: 'Maintenance',
        description: 'Balanced nutrition for health',
        color: 'from-green-500 to-emerald-500',
        icon: CheckIcon
      },
      energy_boost: {
        title: 'Energy Boost',
        description: 'Optimized for sustained energy',
        color: 'from-yellow-500 to-orange-500',
        icon: ZapIcon
      },
      recovery: {
        title: 'Recovery',
        description: 'Enhanced recovery nutrition',
        color: 'from-purple-500 to-violet-500',
        icon: HeartIcon
      }
    };
    return types[type as keyof typeof types] || types.maintenance;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AI Nutrition Plans</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fuel Your Transformation with AI-Powered Nutrition
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get personalized meal plans, macronutrient calculations, and nutrition guidance 
            tailored to your goals and preferences. No generic diets - just science-based 
            nutrition designed for your body.
          </p>
        </div>

        {/* Plan Generation */}
        {!currentPlan && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate Your Nutrition Plan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {['weight_loss', 'muscle_gain', 'maintenance', 'energy_boost', 'recovery'].map((type) => {
                const info = getPlanTypeInfo(type);
                const IconComponent = info.icon;
                
                return (
                  <button
                    key={type}
                    onClick={() => setPlanType(type)}
                    className={`p-6 text-left rounded-xl border-2 transition-all duration-200 ${
                      planType === type
                        ? `border-green-500 bg-gradient-to-r ${info.color} text-white`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        planType === type
                          ? 'bg-white/20'
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          planType === type
                            ? 'text-white'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <h4 className={`font-semibold ${
                        planType === type
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}>
                        {info.title}
                      </h4>
                    </div>
                    <p className={`text-sm ${
                      planType === type
                        ? 'text-white/90'
                        : 'text-gray-600'
                    }`}>
                      {info.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {planType && (
              <div className="text-center">
                <button
                  onClick={generateNutritionPlan}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Plan...</span>
                    </div>
                  ) : (
                    'Generate My Nutrition Plan'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Current Plan Display */}
        {currentPlan && (
          <>
            {/* Plan Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Nutrition Plan</h3>
                <button
                  onClick={() => setCurrentPlan(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Generate New Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {currentPlan.dailyCalories}
                  </div>
                  <div className="text-sm text-gray-600">Daily Calories</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {currentPlan.macronutrients.protein}g
                  </div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {currentPlan.macronutrients.carbs}g
                  </div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {currentPlan.macronutrients.fat}g
                  </div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Hydration Goal</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <HeartIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {currentPlan.hydrationGoal}L
                      </div>
                      <div className="text-sm text-gray-600">Water per day</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Supplements</h4>
                  <div className="space-y-2">
                    {currentPlan.supplements.map((supplement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{supplement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Plan */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Meal Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Breakfast</h4>
                      <button
                        onClick={() => trackMeal('breakfast')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          mealTracking.breakfast
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {mealTracking.breakfast && <CheckIcon className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentPlan.mealPlan.breakfast.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Lunch</h4>
                      <button
                        onClick={() => trackMeal('lunch')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          mealTracking.lunch
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {mealTracking.lunch && <CheckIcon className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentPlan.mealPlan.lunch.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Dinner</h4>
                      <button
                        onClick={() => trackMeal('dinner')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          mealTracking.dinner
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {mealTracking.dinner && <CheckIcon className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentPlan.mealPlan.dinner.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Snacks</h4>
                      <button
                        onClick={() => trackMeal('snacks')}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          mealTracking.snacks
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {mealTracking.snacks && <CheckIcon className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentPlan.mealPlan.snacks.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Today's Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(mealTracking).map(([meal, completed]) => (
                  <div key={meal} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                      completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {completed ? (
                        <CheckIcon className="w-6 h-6 text-green-600" />
                      ) : (
                        <UtensilsIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {meal}
                    </div>
                    <div className={`text-xs ${
                      completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {Object.values(mealTracking).filter(Boolean).length}/4
                </div>
                <div className="text-sm text-gray-600">Meals completed today</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
