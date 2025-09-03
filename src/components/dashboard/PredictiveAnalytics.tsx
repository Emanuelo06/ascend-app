'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, AlertTriangle, Target, BarChart3, Clock, Zap, Brain, CheckCircle } from 'lucide-react';

interface Prediction {
  id: string;
  habitName: string;
  timeframe: '7d' | '30d' | '90d';
  currentTrend: number;
  predictedSuccess: number;
  confidence: number;
  riskFactors: string[];
  opportunities: string[];
  seasonalImpact: number;
}

interface SeasonalPattern {
  month: string;
  avgSuccess: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

interface RiskAssessment {
  id: string;
  habitName: string;
  riskLevel: 'low' | 'medium' | 'high';
  probability: number;
  impact: number;
  mitigation: string;
  timeframe: string;
}

export default function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const loadPredictiveData = async () => {
    const mockPredictions: Prediction[] = [
      {
        id: '1',
        habitName: 'Morning Prayer',
        timeframe: '30d',
        currentTrend: 87,
        predictedSuccess: 91,
        confidence: 89,
        riskFactors: ['Holiday travel', 'Seasonal changes'],
        opportunities: ['New year motivation', 'Spring renewal'],
        seasonalImpact: 8
      },
      {
        id: '2',
        habitName: '30-Minute Workout',
        timeframe: '30d',
        currentTrend: 64,
        predictedSuccess: 78,
        confidence: 76,
        riskFactors: ['Winter weather', 'Holiday stress'],
        opportunities: ['Indoor alternatives', 'Stress relief focus'],
        seasonalImpact: -12
      },
      {
        id: '3',
        habitName: 'Reading',
        timeframe: '30d',
        currentTrend: 92,
        predictedSuccess: 94,
        confidence: 94,
        riskFactors: ['Summer activities', 'Vacation time'],
        opportunities: ['Beach reading', 'Travel time'],
        seasonalImpact: 3
      }
    ];

    const mockSeasonalPatterns: SeasonalPattern[] = [
      { month: 'Jan', avgSuccess: 89, trend: 'up', factors: ['New year motivation', 'Fresh start energy'] },
      { month: 'Feb', avgSuccess: 85, trend: 'down', factors: ['Winter blues', 'Valentine stress'] },
      { month: 'Mar', avgSuccess: 87, trend: 'up', factors: ['Spring renewal', 'Daylight increase'] },
      { month: 'Apr', avgSuccess: 90, trend: 'up', factors: ['Spring energy', 'Outdoor activities'] },
      { month: 'May', avgSuccess: 88, trend: 'stable', factors: ['Good weather', 'Routine established'] },
      { month: 'Jun', avgSuccess: 85, trend: 'down', factors: ['Summer activities', 'Vacation time'] },
      { month: 'Jul', avgSuccess: 82, trend: 'down', factors: ['Vacation disruption', 'Heat waves'] },
      { month: 'Aug', avgSuccess: 84, trend: 'up', factors: ['Back to routine', 'Cooler weather'] },
      { month: 'Sep', avgSuccess: 87, trend: 'up', factors: ['Fall routine', 'School year start'] },
      { month: 'Oct', avgSuccess: 89, trend: 'up', factors: ['Fall motivation', 'Holiday preparation'] },
      { month: 'Nov', avgSuccess: 86, trend: 'down', factors: ['Holiday stress', 'Shorter days'] },
      { month: 'Dec', avgSuccess: 83, trend: 'down', factors: ['Holiday disruption', 'Year-end stress'] }
    ];

    const mockRiskAssessments: RiskAssessment[] = [
      {
        id: '1',
        habitName: 'Morning Prayer',
        riskLevel: 'low',
        probability: 15,
        impact: 20,
        mitigation: 'Set backup reminder times',
        timeframe: 'Next 30 days'
      },
      {
        id: '2',
        habitName: '30-Minute Workout',
        riskLevel: 'medium',
        probability: 45,
        impact: 35,
        mitigation: 'Create indoor workout alternatives',
        timeframe: 'Winter season'
      },
      {
        id: '3',
        habitName: 'Reading',
        riskLevel: 'low',
        probability: 25,
        impact: 15,
        mitigation: 'Adjust reading time to earlier evening',
        timeframe: 'Summer months'
      }
    ];

    setPredictions(mockPredictions);
    setSeasonalPatterns(mockSeasonalPatterns);
    setRiskAssessments(mockRiskAssessments);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'from-green-500 to-green-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'high': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      case 'stable': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Predictive Analytics Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Predictive Analytics</h2>
            <p className="text-blue-200">AI-powered habit forecasting and risk assessment</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">89%</div>
                <div className="text-blue-200 text-sm">Prediction Accuracy</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">30d</div>
                <div className="text-purple-200 text-sm">Forecast Range</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-yellow-200 text-sm">Risk Factors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="flex items-center justify-center space-x-2">
          {(['7d', '30d', '90d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedTimeframe === timeframe
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {timeframe === '7d' ? '7 Days' : timeframe === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Predictions */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
          {selectedTimeframe === '7d' ? '7-Day' : selectedTimeframe === '30d' ? '30-Day' : '90-Day'} Predictions
        </h3>
        
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">{prediction.habitName}</h4>
                <span className="text-blue-200 text-sm">{selectedTimeframe} forecast</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{prediction.currentTrend}%</div>
                  <div className="text-blue-200 text-sm">Current Success</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{prediction.predictedSuccess}%</div>
                  <div className="text-purple-200 text-sm">Predicted Success</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{prediction.confidence}%</div>
                  <div className="text-green-200 text-sm">AI Confidence</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-white font-medium mb-2 text-sm">Risk Factors</h5>
                  <div className="space-y-1">
                    {prediction.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-400" />
                        <span className="text-red-200 text-xs">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-white font-medium mb-2 text-sm">Opportunities</h5>
                  <div className="space-y-1">
                    {prediction.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-green-400" />
                        <span className="text-green-200 text-xs">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Seasonal Impact</span>
                  <span className={`font-semibold ${
                    prediction.seasonalImpact > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {prediction.seasonalImpact > 0 ? '+' : ''}{prediction.seasonalImpact}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Patterns */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Seasonal Performance Patterns</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {seasonalPatterns.map((pattern, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-2 border border-blue-400/20">
                <div className="text-xs text-blue-200 mb-1">{pattern.month}</div>
                <div className="text-lg font-bold text-white mb-1">{pattern.avgSuccess}%</div>
                <div className="flex justify-center">
                  {getTrendIcon(pattern.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-blue-200 text-sm">
            Your habits show seasonal variations. Plan ahead for challenging months!
          </p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
          Risk Assessment & Mitigation
        </h3>
        
        <div className="space-y-4">
          {riskAssessments.map((risk) => (
            <div key={risk.id} className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-400/20">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getRiskColor(risk.riskLevel)}`}>
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{risk.habitName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      risk.riskLevel === 'high' ? 'bg-red-500/20 text-red-200' :
                      risk.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-200' :
                      'bg-green-500/20 text-green-200'
                    }`}>
                      {risk.riskLevel} risk
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-red-200 text-sm">Probability: </span>
                      <span className="text-white">{risk.probability}%</span>
                    </div>
                    <div>
                      <span className="text-red-200 text-sm">Impact: </span>
                      <span className="text-white">{risk.impact}%</span>
                    </div>
                    <div>
                      <span className="text-red-200 text-sm">Timeframe: </span>
                      <span className="text-white">{risk.timeframe}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-green-200 text-sm">Mitigation: </span>
                    <span className="text-white">{risk.mitigation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
        <h3 className="text-xl font-bold text-white mb-4">AI Action Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h4 className="text-white font-semibold mb-2">Immediate Actions (Next 7 days)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-blue-200">Adjust workout time to 6:00 PM</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-blue-200">Set weekend-specific prayer reminders</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h4 className="text-white font-semibold mb-2">Strategic Planning (Next 30 days)</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200">Prepare winter workout alternatives</span>
              </li>
              <li className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200">Create holiday habit maintenance plan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
