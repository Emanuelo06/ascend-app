'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  X,
  Trophy,
  Clock,
  Star,
  Plus,
  Target,
  Calendar,
  Zap,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  purpose: string;
  progress_pct: number;
}

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  goalId?: string;
  onChallengeCreated: () => void;
}

export default function CreateChallengeModal({ isOpen, onClose, userId, goalId, onChallengeCreated }: CreateChallengeModalProps) {
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationDays: 7,
    rewardXp: 50,
    rewardBadge: '',
    selectedGoalId: goalId || '',
    tasks: [] as any[]
  });

  useEffect(() => {
    if (isOpen) {
      loadGoals();
    }
  }, [isOpen]);

  const loadGoals = async () => {
    try {
      const response = await fetch(`/api/goals?userId=${userId}&state=active`);
      const data = await response.json();
      if (data.data) {
        setGoals(data.data);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleCreateChallenge = async () => {
    if (!formData.title || !formData.description) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          goalId: formData.selectedGoalId || null,
          title: formData.title,
          description: formData.description,
          durationDays: formData.durationDays,
          rewardXp: formData.rewardXp,
          rewardBadge: formData.rewardBadge || null,
          cadence: { type: 'daily' },
          tasks: formData.tasks
        })
      });

      if (response.ok) {
        onChallengeCreated();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      durationDays: 7,
      rewardXp: 50,
      rewardBadge: '',
      selectedGoalId: goalId || '',
      tasks: []
    });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, {
        title: '',
        description: '',
        type: 'custom',
        dailyRequirement: { unit: 'minutes', target: 5 }
      }]
    });
  };

  const updateTask = (index: number, field: string, value: any) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setFormData({ ...formData, tasks: newTasks });
  };

  const removeTask = (index: number) => {
    const newTasks = formData.tasks.filter((_, i) => i !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const getDurationPresets = () => [
    { days: 3, label: '3 days', description: 'Quick win' },
    { days: 7, label: '1 week', description: 'Most popular' },
    { days: 14, label: '2 weeks', description: 'Build momentum' },
    { days: 21, label: '3 weeks', description: 'Form habit' }
  ];

  const getRewardPresets = () => [
    { xp: 25, badge: 'starter', label: 'Starter' },
    { xp: 50, badge: 'warrior', label: 'Warrior' },
    { xp: 100, badge: 'champion', label: 'Champion' },
    { xp: 200, badge: 'legend', label: 'Legend' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Micro-Challenge</h2>
              <p className="text-blue-200 text-sm">Create a focused challenge to boost your progress</p>
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
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Challenge Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 7-Day Morning Routine"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this challenge involves..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Link to Goal (Optional)</label>
                <select
                  value={formData.selectedGoalId}
                  onChange={(e) => setFormData({ ...formData, selectedGoalId: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">No specific goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title} ({Math.round(goal.progress_pct)}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white font-medium mb-3">Challenge Duration</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getDurationPresets().map((preset) => (
                  <Card
                    key={preset.days}
                    className={`p-4 cursor-pointer transition-all ${
                      formData.durationDays === preset.days
                        ? 'bg-yellow-500/20 border-yellow-400 ring-2 ring-yellow-400/50'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                    onClick={() => setFormData({ ...formData, durationDays: preset.days })}
                  >
                    <div className="text-center">
                      <div className="text-white font-semibold">{preset.label}</div>
                      <div className="text-blue-200 text-sm">{preset.description}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <label className="block text-white font-medium mb-3">Rewards</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getRewardPresets().map((preset) => (
                  <Card
                    key={preset.xp}
                    className={`p-4 cursor-pointer transition-all ${
                      formData.rewardXp === preset.xp
                        ? 'bg-yellow-500/20 border-yellow-400 ring-2 ring-yellow-400/50'
                        : 'bg-white/10 border-white/20 hover:bg-white/15'
                    }`}
                    onClick={() => setFormData({ 
                      ...formData, 
                      rewardXp: preset.xp, 
                      rewardBadge: preset.badge 
                    })}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">{preset.xp} XP</span>
                      </div>
                      <div className="text-blue-200 text-sm">{preset.label}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white font-medium">Challenge Tasks</label>
                <Button
                  onClick={addTask}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </Button>
              </div>

              {formData.tasks.length > 0 ? (
                <div className="space-y-3">
                  {formData.tasks.map((task, index) => (
                    <Card key={index} className="bg-white/5 border-white/10 p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-medium">Task {index + 1}</h4>
                          <Button
                            onClick={() => removeTask(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div>
                          <Input
                            value={task.title}
                            onChange={(e) => updateTask(index, 'title', e.target.value)}
                            placeholder="Task title"
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          />
                        </div>
                        
                        <div>
                          <Textarea
                            value={task.description}
                            onChange={(e) => updateTask(index, 'description', e.target.value)}
                            placeholder="Task description"
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-blue-200 text-sm mb-1">Daily Requirement</label>
                            <Input
                              type="number"
                              value={task.dailyRequirement?.target || 5}
                              onChange={(e) => updateTask(index, 'dailyRequirement', {
                                ...task.dailyRequirement,
                                target: parseInt(e.target.value) || 5
                              })}
                              className="bg-white/10 border-white/20 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-blue-200 text-sm mb-1">Unit</label>
                            <select
                              value={task.dailyRequirement?.unit || 'minutes'}
                              onChange={(e) => updateTask(index, 'dailyRequirement', {
                                ...task.dailyRequirement,
                                unit: e.target.value
                              })}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                            >
                              <option value="minutes">Minutes</option>
                              <option value="hours">Hours</option>
                              <option value="count">Count</option>
                              <option value="pages">Pages</option>
                              <option value="steps">Steps</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/5 border-white/10 p-6 text-center">
                  <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-sm">No tasks added yet</p>
                  <p className="text-gray-400 text-xs mt-1">Add tasks to define what needs to be done daily</p>
                </Card>
              )}
            </div>

            {/* Preview */}
            <Card className="bg-white/5 border-white/10 p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Challenge Preview
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Duration:</span>
                  <span className="text-white">{formData.durationDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Reward:</span>
                  <span className="text-white">{formData.rewardXp} XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Tasks:</span>
                  <span className="text-white">{formData.tasks.length}</span>
                </div>
                {formData.selectedGoalId && (
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Linked Goal:</span>
                    <span className="text-white">
                      {goals.find(g => g.id === formData.selectedGoalId)?.title || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-blue-200 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateChallenge}
                disabled={loading || !formData.title || !formData.description}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Create Challenge
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
