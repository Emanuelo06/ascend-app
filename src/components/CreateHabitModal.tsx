'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Plus, 
  Target, 
  Clock, 
  Calendar,
  Zap,
  Lightbulb,
  Brain,
  Star,
  Heart,
  Dumbbell,
  BookOpen,
  Users,
  DollarSign,
  Sun,
  Moon,
  Coffee,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Habit } from '@/types';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userId: string;
}

interface AISuggestion {
  id: string;
  title: string;
  purpose: string;
  moment: string;
  category: string;
  difficulty: number;
  confidence: number;
  reasoning: string;
}

export default function CreateHabitModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  userId 
}: CreateHabitModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    moment: 'morning',
    category: 'spiritual',
    cadence: { type: 'daily' },
    dose: { unit: 'minutes', target: 10 },
    window: { start: '07:00', end: '11:00' },
    difficulty: 2,
    priority: 'medium'
  });
  
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const moments = [
    { id: 'morning', label: 'Morning', icon: Sun, color: 'text-yellow-400' },
    { id: 'midday', label: 'Midday', icon: Coffee, color: 'text-orange-400' },
    { id: 'evening', label: 'Evening', icon: Moon, color: 'text-blue-400' }
  ];

  const categories = [
    { id: 'spiritual', label: 'Spiritual', icon: Heart, color: 'text-red-400' },
    { id: 'physical', label: 'Physical', icon: Dumbbell, color: 'text-green-400' },
    { id: 'mental', label: 'Mental', icon: Brain, color: 'text-blue-400' },
    { id: 'relational', label: 'Relational', icon: Users, color: 'text-purple-400' },
    { id: 'financial', label: 'Financial', icon: DollarSign, color: 'text-yellow-400' }
  ];

  const difficulties = [
    { value: 1, label: 'Easy', color: 'text-green-400' },
    { value: 2, label: 'Medium', color: 'text-yellow-400' },
    { value: 3, label: 'Hard', color: 'text-red-400' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-blue-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-red-400' }
  ];

  useEffect(() => {
    if (isOpen) {
      generateAISuggestions();
    }
  }, [isOpen]);

  const generateAISuggestions = async () => {
    setLoading(true);
    
    // Simulate AI suggestions based on common patterns
    const suggestions: AISuggestion[] = [
      {
        id: '1',
        title: 'Morning Gratitude',
        purpose: 'Start each day with appreciation and positive mindset',
        moment: 'morning',
        category: 'spiritual',
        difficulty: 1,
        confidence: 0.95,
        reasoning: 'High success rate, builds positive momentum'
      },
      {
        id: '2',
        title: 'Hydration Check',
        purpose: 'Stay hydrated throughout the day for optimal health',
        moment: 'morning',
        category: 'physical',
        difficulty: 1,
        confidence: 0.90,
        reasoning: 'Simple reminder, immediate health benefits'
      },
      {
        id: '3',
        title: 'Mindful Breathing',
        purpose: 'Take 5 deep breaths to center yourself',
        moment: 'midday',
        category: 'mental',
        difficulty: 1,
        confidence: 0.88,
        reasoning: 'Quick stress relief, can be done anywhere'
      },
      {
        id: '4',
        title: 'Evening Reflection',
        purpose: 'Review your day and plan for tomorrow',
        moment: 'evening',
        category: 'mental',
        difficulty: 2,
        confidence: 0.85,
        reasoning: 'Good for planning and self-awareness'
      }
    ];

    // Filter suggestions based on current form data
    const filteredSuggestions = suggestions.filter(suggestion => {
      if (formData.title && !suggestion.title.toLowerCase().includes(formData.title.toLowerCase())) {
        return false;
      }
      if (formData.category && suggestion.category !== formData.category) {
        return false;
      }
      if (formData.moment && suggestion.moment !== formData.moment) {
        return false;
      }
      return true;
    });

    setAiSuggestions(filteredSuggestions);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Habit title is required';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    if (formData.dose.target <= 0) {
      newErrors.dose = 'Dose target must be greater than 0';
    }

    if (formData.window.start >= formData.window.end) {
      newErrors.window = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newHabit = {
      userId,
      title: formData.title.trim(),
      purpose: formData.purpose.trim(),
      moment: formData.moment,
      category: formData.category,
      cadence: formData.cadence,
      dose: formData.dose,
      window: formData.window,
      difficulty: formData.difficulty,
      priority: formData.priority,
      archived: false
    };

    onSubmit(newHabit);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      purpose: '',
      moment: 'morning',
      category: 'spiritual',
      cadence: { type: 'daily' },
      dose: { unit: 'minutes', target: 10 },
      window: { start: '07:00', end: '11:00' },
      difficulty: 2,
      priority: 'medium'
    });
    setErrors({});
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    setFormData(prev => ({
      ...prev,
      title: suggestion.title,
      purpose: suggestion.purpose,
      moment: suggestion.moment as any,
      category: suggestion.category as any,
      difficulty: suggestion.difficulty
    }));
    
    // Auto-adjust window based on moment
    if (suggestion.moment === 'morning') {
      setFormData(prev => ({
        ...prev,
        window: { start: '06:00', end: '11:00' }
      }));
    } else if (suggestion.moment === 'midday') {
      setFormData(prev => ({
        ...prev,
        window: { start: '12:00', end: '16:00' }
      }));
    } else if (suggestion.moment === 'evening') {
      setFormData(prev => ({
        ...prev,
        window: { start: '18:00', end: '22:00' }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-white/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl">Create New Habit</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Habit Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Morning Prayer, Daily Exercise"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
                    errors.title ? 'border-red-400' : 'border-white/20'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Purpose</label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Why is this habit important to you?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                {errors.purpose && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.purpose}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Moment</label>
                  <div className="space-y-2">
                    {moments.map((moment) => {
                      const Icon = moment.icon;
                      return (
                        <button
                          key={moment.id}
                          type="button"
                          onClick={() => handleInputChange('moment', moment.id)}
                          className={`w-full p-3 rounded-lg border transition-all ${
                            formData.moment === moment.id
                              ? 'border-blue-400 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${moment.color}`} />
                            <span className="text-white">{moment.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleInputChange('category', category.id)}
                          className={`w-full p-3 rounded-lg border transition-all ${
                            formData.category === category.id
                              ? 'border-blue-400 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${category.color}`} />
                            <span className="text-white">{category.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Difficulty</label>
                  <div className="space-y-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => handleInputChange('difficulty', diff.value)}
                        className={`w-full p-3 rounded-lg border transition-all ${
                          formData.difficulty === diff.value
                            ? 'border-blue-400 bg-blue-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className={`${diff.color} font-medium`}>{diff.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Priority</label>
                  <div className="space-y-2">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`w-full p-3 rounded-lg border transition-all ${
                          formData.priority === priority.value
                            ? 'border-blue-400 bg-blue-500/20'
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className={`${priority.color} font-medium`}>{priority.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Dose</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.dose.target}
                      onChange={(e) => handleInputChange('dose', { ...formData.dose, target: Number(e.target.value) })}
                      min="1"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                    <select
                      value={formData.dose.unit}
                      onChange={(e) => handleInputChange('dose', { ...formData.dose, unit: e.target.value })}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      <option value="minutes" className="bg-slate-800 text-white">minutes</option>
                      <option value="reps" className="bg-slate-800 text-white">reps</option>
                      <option value="pages" className="bg-slate-800 text-white">pages</option>
                      <option value="liters" className="bg-slate-800 text-white">liters</option>
                    </select>
                  </div>
                  {errors.dose && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.dose}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Time Window</label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      value={formData.window.start}
                      onChange={(e) => handleInputChange('window', { ...formData.window, start: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                    <span className="text-white self-center">to</span>
                    <input
                      type="time"
                      value={formData.window.end}
                      onChange={(e) => handleInputChange('window', { ...formData.window, end: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                  </div>
                  {errors.window && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.window}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-400 hover:to-purple-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Habit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-white/20 text-blue-200 hover:bg-white/10"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* AI Suggestions Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  AI Suggestions
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className="text-blue-200 hover:text-white hover:bg-white/10"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showAISuggestions ? 'Hide' : 'Show'}
                </Button>
              </div>

              {showAISuggestions && (
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                      <span className="text-blue-200 text-sm">Generating suggestions...</span>
                    </div>
                  ) : (
                    aiSuggestions.map((suggestion) => (
                      <Card
                        key={suggestion.id}
                        className="bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-semibold text-sm">{suggestion.title}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400 text-xs">
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-blue-200 text-xs mb-3">{suggestion.purpose}</p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                                                             {(() => {
                                 const moment = moments.find(m => m.id === suggestion.moment);
                                 return moment?.icon ? (
                                   <moment.icon
                                     className={`w-3 h-3 ${moment.color}`}
                                   />
                                 ) : null;
                               })()}
                              <span className="text-blue-300 capitalize">{suggestion.moment}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              suggestion.difficulty === 1 ? 'bg-green-500/20 text-green-200' :
                              suggestion.difficulty === 2 ? 'bg-yellow-500/20 text-yellow-200' :
                              'bg-red-500/20 text-red-200'
                            }`}>
                              {suggestion.difficulty}/3
                            </span>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-blue-200 text-xs italic">"{suggestion.reasoning}"</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                  
                  {aiSuggestions.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-8 h-8 text-blue-400/50 mx-auto mb-2" />
                      <p className="text-blue-300 text-sm">No suggestions available</p>
                      <p className="text-blue-200 text-xs">Try adjusting your filters</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
