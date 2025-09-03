'use client';

import { useState, useEffect } from 'react';
import { Zap, Clock, Target, TrendingUp, AlertCircle, CheckCircle, Play, Pause, RefreshCw } from 'lucide-react';

interface LiveMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: Date;
}

interface Optimization {
  id: string;
  habitName: string;
  type: 'timing' | 'difficulty' | 'environment' | 'motivation';
  currentSetting: string;
  recommendedSetting: string;
  impact: number;
  confidence: number;
  applied: boolean;
}

export default function RealTimeOptimizer() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(updateLiveData, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const mockMetrics: LiveMetric[] = [
      {
        id: '1',
        name: 'Morning Prayer Success',
        currentValue: 87,
        targetValue: 90,
        unit: '%',
        status: 'optimal',
        trend: 'up',
        lastUpdate: new Date()
      },
      {
        id: '2',
        name: 'Workout Consistency',
        currentValue: 64,
        targetValue: 80,
        unit: '%',
        status: 'warning',
        trend: 'down',
        lastUpdate: new Date()
      },
      {
        id: '3',
        name: 'Reading Time',
        currentValue: 25,
        targetValue: 30,
        unit: 'min',
        status: 'warning',
        trend: 'stable',
        lastUpdate: new Date()
      },
      {
        id: '4',
        name: 'Sleep Quality',
        currentValue: 7.2,
        targetValue: 8.0,
        unit: 'hours',
        status: 'optimal',
        trend: 'up',
        lastUpdate: new Date()
      }
    ];

    const mockOptimizations: Optimization[] = [
      {
        id: '1',
        habitName: '30-Minute Workout',
        type: 'timing',
        currentSetting: '5:30 PM',
        recommendedSetting: '6:00 PM',
        impact: 23,
        confidence: 87,
        applied: false
      },
      {
        id: '2',
        habitName: 'Reading',
        type: 'environment',
        currentSetting: 'Bedroom',
        recommendedSetting: 'Living Room',
        impact: 15,
        confidence: 76,
        applied: false
      },
      {
        id: '3',
        habitName: 'Morning Prayer',
        type: 'difficulty',
        currentSetting: '15 minutes',
        recommendedSetting: '10 minutes',
        impact: 12,
        confidence: 92,
        applied: true
      }
    ];

    setMetrics(mockMetrics);
    setOptimizations(mockOptimizations);
  };

  const updateLiveData = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      currentValue: metric.currentValue + (Math.random() - 0.5) * 2,
      lastUpdate: new Date()
    })));
    setLastRefresh(new Date());
  };

  const applyOptimization = (id: string) => {
    setOptimizations(prev => prev.map(opt => 
      opt.id === id ? { ...opt, applied: true } : opt
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'timing': return <Clock className="w-4 h-4" />;
      case 'difficulty': return <Target className="w-4 h-4" />;
      case 'environment': return <Zap className="w-4 h-4" />;
      case 'motivation': return <TrendingUp className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Optimization Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Real-Time Optimizer</h2>
              <p className="text-green-200">Live habit performance monitoring and instant optimization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-white">{isLive ? 'LIVE' : 'PAUSED'}</span>
            </div>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className={`p-2 rounded-lg ${isLive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
            >
              {isLive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={updateLiveData}
              className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="text-right text-xs text-green-200">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Target className="w-6 h-6 mr-2 text-green-400" />
          Live Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-gradient-to-r from-blue-500/10 to-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">{metric.name}</h4>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${getStatusColor(metric.status)}`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Current</span>
                  <span className="text-white font-semibold text-lg">
                    {metric.currentValue.toFixed(1)}{metric.unit}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Target</span>
                  <span className="text-white font-semibold">
                    {metric.targetValue}{metric.unit}
                  </span>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.currentValue >= metric.targetValue ? 'bg-green-400' :
                      metric.currentValue >= metric.targetValue * 0.8 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${Math.min((metric.currentValue / metric.targetValue) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-right text-xs text-blue-200">
                  Updated: {metric.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Optimizations */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-400" />
          AI-Powered Optimizations
        </h3>
        
        <div className="space-y-4">
          {optimizations.map((optimization) => (
            <div key={optimization.id} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/20">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                  {getTypeIcon(optimization.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-semibold">{optimization.habitName}</h4>
                    <span className="text-xs text-yellow-200 uppercase">{optimization.type}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-blue-200 text-sm">Current: </span>
                      <span className="text-white">{optimization.currentSetting}</span>
                    </div>
                    <div>
                      <span className="text-green-200 text-sm">Recommended: </span>
                      <span className="text-white">{optimization.recommendedSetting}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-purple-200 text-sm">
                        Impact: +{optimization.impact}%
                      </span>
                      <span className="text-blue-200 text-sm">
                        Confidence: {optimization.confidence}%
                      </span>
                    </div>
                    
                    {!optimization.applied ? (
                      <button
                        onClick={() => applyOptimization(optimization.id)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all text-sm"
                      >
                        Apply
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Applied</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2 text-red-400" />
          Performance Alerts
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-400/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-medium">Workout consistency dropping</p>
              <p className="text-red-200 text-sm">Consider adjusting timing or difficulty level</p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm font-medium">
              Review →
            </button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-medium">Reading time below target</p>
              <p className="text-yellow-200 text-sm">Try reading earlier in the evening</p>
            </div>
            <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              Optimize →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
