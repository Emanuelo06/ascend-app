'use client';

import React, { useState, useEffect } from 'react';
import { X, Brain, Lightbulb, Target, Clock, Zap } from 'lucide-react';
import { Habit } from '@/types';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    moment: 'morning' as 'morning' | 'midday' | 'evening',
    cadence: 'daily' as 'daily' | 'weekdays' | 'custom',
    doseUnit: 'minutes',
    doseTarget: 10,
    windowStart: '07:00',
    windowEnd: '11:00',
    difficulty: 2 as 1 | 2 | 3
  });

  const [aiSuggestions, setAiSuggestions] = useState<Array<{
    type: 'timing' | 'difficulty' | 'category' | 'purpose';
    title: string;
    description: string;
    confidence: number;
    action: string;
  }>>([]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isOpen && formData.title) {
      generateAISuggestions();
    }
  }, [isOpen, formData.title, formData.moment]);

  const generateAISuggestions = () => {
    // Simulate AI analysis based on habit title and moment
    const suggestions = [];
    
    if (formData.title.toLowerCase().includes('prayer') || formData.title.toLowerCase().includes('meditation')) {
      suggestions.push({
        type: 'timing',
        title: 'Optimal Prayer Time',
        description: 'Spiritual practices are most effective in the early morning when the mind is clear.',
        confidence: 92,
        action: 'Consider 6:00 AM start time'
      });
    }
    
    if (formData.title.toLowerCase().includes('workout') || formData.title.toLowerCase().includes('exercise')) {
      suggestions.push({
        type: 'difficulty',
        title: 'Progressive Difficulty',
        description: 'Start with easier difficulty and gradually increase as you build consistency.',
        confidence: 88,
        action: 'Begin with difficulty level 1'
      });
    }
    
    if (formData.moment === 'morning') {
      suggestions.push({
        type: 'timing',
        title: 'Morning Routine Optimization',
        description: 'Morning habits have higher success rates when started before 8:00 AM.',
        confidence: 85,
        action: 'Set start time to 7:00 AM'
      });
    }
    
    if (formData.title.toLowerCase().includes('reading') || formData.title.toLowerCase().includes('study')) {
      suggestions.push({
        type: 'category',
        title: 'Learning Habit Enhancement',
        description: 'Reading habits work best with specific time blocks and quiet environments.',
        confidence: 90,
        action: 'Add 30-minute time blocks'
      });
    }
    
    setAiSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      userId: 'demo-user',
      title: formData.title,
      purpose: formData.purpose,
      moment: formData.moment,
      cadence: { type: formData.cadence },
      dose: { unit: formData.doseUnit, target: formData.doseTarget },
      window: { start: formData.windowStart, end: formData.windowEnd },
      difficulty: formData.difficulty,
      archived: false
    });
    onClose();
    setFormData({
      title: '',
      purpose: '',
      moment: 'morning',
      cadence: 'daily',
      doseUnit: 'minutes',
      doseTarget: 10,
      windowStart: '07:00',
      windowEnd: '11:00',
      difficulty: 2
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Habit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-white font-medium">Habit Title</label>
              {formData.title && (
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <Brain className="w-3 h-3" />
                  <span>{showSuggestions ? 'Hide' : 'Show'} AI Tips</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder-blue-200/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              placeholder="e.g., Morning Prayer"
              required
            />
          </div>

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-400/20">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold text-sm">AI Suggestions</h3>
              </div>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start space-x-2">
                      <div className="p-1 rounded bg-gradient-to-r from-purple-500 to-blue-600">
                        {suggestion.type === 'timing' && <Clock className="w-3 h-3 text-white" />}
                        {suggestion.type === 'difficulty' && <Target className="w-3 h-3 text-white" />}
                        {suggestion.type === 'category' && <Lightbulb className="w-3 h-3 text-white" />}
                        {suggestion.type === 'purpose' && <Zap className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-blue-200 text-xs mb-2">{suggestion.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-200 text-xs">Confidence: {suggestion.confidence}%</span>
                          <button
                            type="button"
                            onClick={() => {
                              // Apply suggestion logic here
                              if (suggestion.type === 'timing' && suggestion.action.includes('6:00 AM')) {
                                setFormData(prev => ({ ...prev, windowStart: '06:00' }));
                              } else if (suggestion.type === 'timing' && suggestion.action.includes('7:00 AM')) {
                                setFormData(prev => ({ ...prev, windowStart: '07:00' }));
                              } else if (suggestion.type === 'difficulty' && suggestion.action.includes('level 1')) {
                                setFormData(prev => ({ ...prev, difficulty: 1 }));
                              }
                            }}
                            className="text-purple-400 hover:text-purple-300 text-xs font-medium"
                          >
                            Apply →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">Purpose</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder-blue-200/50 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              placeholder="Why is this habit important to you?"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Moment</label>
              <select
                value={formData.moment}
                onChange={(e) => setFormData(prev => ({ ...prev, moment: e.target.value as 'morning' | 'midday' | 'evening' }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              >
                <option value="morning">Morning</option>
                <option value="midday">Midday</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Frequency</label>
              <select
                value={formData.cadence}
                onChange={(e) => setFormData(prev => ({ ...prev, cadence: e.target.value as 'daily' | 'weekdays' | 'custom' }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Dose</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.doseTarget}
                  onChange={(e) => setFormData(prev => ({ ...prev, doseTarget: parseInt(e.target.value) }))}
                  className="flex-1 bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                  min="1"
                  required
                />
                <select
                  value={formData.doseUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, doseUnit: e.target.value }))}
                  className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                >
                  <option value="minutes">Minutes</option>
                  <option value="reps">Reps</option>
                  <option value="pages">Pages</option>
                  <option value="items">Items</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) as 1 | 2 | 3 }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
              >
                <option value={1}>Easy (1)</option>
                <option value={2}>Medium (2)</option>
                <option value={3}>Hard (3)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Start Time</label>
              <input
                type="time"
                value={formData.windowStart}
                onChange={(e) => setFormData(prev => ({ ...prev, windowStart: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">End Time</label>
              <input
                type="time"
                value={formData.windowEnd}
                onChange={(e) => setFormData(prev => ({ ...prev, windowEnd: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabitModal;
