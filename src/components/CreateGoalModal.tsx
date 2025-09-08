'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  X,
  Target,
  Calendar,
  Plus,
  Sparkles,
  Clock,
  Hash,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Trophy,
  Heart,
  Brain,
  BookOpen,
  Users,
  DollarSign
} from 'lucide-react';

interface GoalTemplate {
  id: string;
  title: string;
  purpose: string;
  category: string;
  target_type: string;
  target_value: any;
  suggested_duration_days: number;
  starter_habits: any[];
  difficulty_level: number;
}

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onGoalCreated: () => void;
}

export default function CreateGoalModal({ isOpen, onClose, userId, onGoalCreated }: CreateGoalModalProps) {
  const [step, setStep] = useState<'template' | 'custom' | 'details'>('template');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<GoalTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    targetType: 'numeric',
    targetValue: { type: 'times', value: 1 },
    targetDate: '',
    priority: 0,
    category: 'physical'
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/goals/templates');
      const data = await response.json();
      if (data.data) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      purpose: template.purpose,
      targetType: template.target_type,
      targetValue: template.target_value,
      targetDate: calculateTargetDate(template.suggested_duration_days),
      priority: 0,
      category: template.category
    });
    setStep('details');
  };

  const calculateTargetDate = (days: number): string => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    return targetDate.toISOString().split('T')[0];
  };

  const handleCreateGoal = async () => {
    if (!formData.title || !formData.purpose) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: formData.title,
          purpose: formData.purpose,
          targetType: formData.targetType,
          targetValue: formData.targetValue,
          targetDate: formData.targetDate || null,
          priority: formData.priority,
          category: formData.category,
          metadata: {
            source: selectedTemplate ? 'template' : 'manual',
            template_id: selectedTemplate?.id
          }
        })
      });

      if (response.ok) {
        onGoalCreated();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('template');
    setSelectedTemplate(null);
    setFormData({
      title: '',
      purpose: '',
      targetType: 'numeric',
      targetValue: { type: 'times', value: 1 },
      targetDate: '',
      priority: 0,
      category: 'physical'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Heart className="w-5 h-5" />;
      case 'mental': return <Brain className="w-5 h-5" />;
      case 'spiritual': return <BookOpen className="w-5 h-5" />;
      case 'relational': return <Users className="w-5 h-5" />;
      case 'financial': return <DollarSign className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'from-red-500 to-pink-500';
      case 'mental': return 'from-blue-500 to-indigo-500';
      case 'spiritual': return 'from-purple-500 to-violet-500';
      case 'relational': return 'from-green-500 to-emerald-500';
      case 'financial': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Goal</h2>
              <p className="text-blue-200 text-sm">
                {step === 'template' && 'Choose a template or create custom'}
                {step === 'custom' && 'Define your custom goal'}
                {step === 'details' && 'Finalize your goal details'}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 'template' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Choose Your Starting Point</h3>
                <p className="text-blue-200">Select a template or create a custom goal</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Goal Option */}
                <Card
                  className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer group"
                  onClick={() => setStep('custom')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">Custom Goal</h4>
                    <p className="text-blue-200 text-sm">Create a completely custom goal from scratch</p>
                  </div>
                </Card>

                {/* Template Options */}
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(template.category)} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        {getCategoryIcon(template.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">{template.title}</h4>
                        <p className="text-blue-200 text-sm mb-3">{template.purpose}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{template.duration_days} days</span>
                          <span>Level {template.difficulty_level}/5</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 'custom' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Create Custom Goal</h3>
                <p className="text-blue-200">Define your own goal from scratch</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Goal Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Read 12 books this year"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Purpose (Why this matters)</label>
                  <Textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g., Expand my knowledge and improve focus"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="physical">Physical Health</option>
                      <option value="mental">Mental Fitness</option>
                      <option value="spiritual">Spiritual Growth</option>
                      <option value="relational">Relationships</option>
                      <option value="financial">Financial Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Target Type</label>
                    <select
                      value={formData.targetType}
                      onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="numeric">Number of times</option>
                      <option value="duration">Duration (minutes/hours)</option>
                      <option value="frequency">Frequency (daily/weekly)</option>
                      <option value="binary">Yes/No completion</option>
                      <option value="milestone">Milestone-based</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Target Value</label>
                    <Input
                      type="number"
                      value={formData.targetValue.value}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        targetValue: { ...formData.targetValue, value: parseInt(e.target.value) || 1 }
                      })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Target Date (Optional)</label>
                    <Input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setStep('template')}
                  variant="ghost"
                  className="text-blue-200 hover:text-white"
                >
                  Back to Templates
                </Button>
                <Button
                  onClick={() => setStep('details')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Review & Create</h3>
                <p className="text-blue-200">Review your goal details and create it</p>
              </div>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(formData.category)} rounded-xl flex items-center justify-center`}>
                      {getCategoryIcon(formData.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">{formData.title}</h4>
                      <p className="text-blue-200 mb-4">{formData.purpose}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200">Category:</span>
                          <span className="text-white capitalize">{formData.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200">Target:</span>
                          <span className="text-white">{formData.targetValue.value} {formData.targetType}</span>
                        </div>
                        {formData.targetDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-blue-200">Target Date:</span>
                            <span className="text-white">{new Date(formData.targetDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-blue-200">Priority:</span>
                          <span className="text-white">{formData.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {selectedTemplate && selectedTemplate.starter_habits && selectedTemplate.starter_habits.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                    Starter Habits (Optional)
                  </h4>
                  <div className="space-y-3">
                    {selectedTemplate.starter_habits.map((habit, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-white font-medium">{habit.title}</div>
                          <div className="text-blue-200 text-sm">
                            {habit.duration} minutes • {habit.moment}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    These habits will be automatically created and linked to your goal
                  </p>
                </Card>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setStep(selectedTemplate ? 'template' : 'custom')}
                  variant="ghost"
                  className="text-blue-200 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateGoal}
                  disabled={loading || !formData.title || !formData.purpose}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Create Goal
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
