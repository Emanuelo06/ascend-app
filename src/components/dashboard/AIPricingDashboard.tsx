'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  DollarSignIcon, 
  BrainIcon,
  ClockIcon,
  TargetIcon,
  BarChart3Icon,
  ZapIcon
} from '@/components/ui/icons';

interface PricingData {
  currentPricing: {
    basePrice: number;
    currentPrice: number;
    discountPercentage: number;
    surgePricing: number;
    pricingStrategy: string;
    confidence: number;
    nextAdjustmentDate: string;
  };
  insights: {
    averagePrice: number;
    averageConversionRate: number;
    averageChurnRate: number;
    priceVolatility: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    recommendations: string[];
  };
  systemStatus: {
    lastOptimization: string | null;
    totalOptimizations: number;
    nextScheduledOptimization: string;
    isAutomated: boolean;
  };
}

export default function AIPricingDashboard() {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchPricingData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchPricingData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await fetch('/api/stripe/optimize-pricing');
      const data = await response.json();
      
      if (data.success) {
        setPricingData(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerOptimization = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/optimize-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual' })
      });
      
      if (response.ok) {
        await fetchPricingData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to trigger optimization:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load pricing data</p>
      </div>
    );
  }

  const { currentPricing, insights, systemStatus } = pricingData;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUpIcon className="w-5 h-5 text-green-500" />;
      case 'decreasing':
        return <TrendingDownIcon className="w-5 h-5 text-red-500" />;
      default:
        return <BarChart3Icon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BrainIcon className="w-6 h-6 text-blue-600" />
            AI Pricing Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Fully automated pricing optimization powered by artificial intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerOptimization}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <ZapIcon className="w-4 h-4" />
            Optimize Now
          </button>
          <div className="text-sm text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Current Pricing Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Price</h3>
            <DollarSignIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${currentPricing.currentPrice.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Base: ${currentPricing.basePrice.toFixed(2)}
          </div>
          {currentPricing.discountPercentage > 0 && (
            <div className="mt-2 text-sm text-green-600">
              {currentPricing.discountPercentage}% discount applied
            </div>
          )}
          {currentPricing.surgePricing > 0 && (
            <div className="mt-2 text-sm text-orange-600">
              +${currentPricing.surgePricing.toFixed(2)} surge pricing
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Strategy</h3>
            <TargetIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-lg font-medium text-gray-900 capitalize">
            {currentPricing.pricingStrategy.replace(/_/g, ' ')}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Confidence: {(currentPricing.confidence * 100).toFixed(1)}%
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Next adjustment: {formatDate(currentPricing.nextAdjustmentDate)}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Market Trend</h3>
            {getTrendIcon(insights.trend)}
          </div>
          <div className={`text-lg font-medium capitalize ${getTrendColor(insights.trend)}`}>
            {insights.trend}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Volatility: {insights.priceVolatility.toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Conversion: {insights.averageConversionRate.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-medium">{insights.averageConversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Churn Rate</span>
              <span className="font-medium">{insights.averageChurnRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Price</span>
              <span className="font-medium">${insights.averagePrice.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Optimizations</span>
              <span className="font-medium">{systemStatus.totalOptimizations}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Optimization</span>
              <span className="font-medium">
                {systemStatus.lastOptimization ? formatDate(systemStatus.lastOptimization) : 'Never'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next Scheduled</span>
              <span className="font-medium">{formatDate(systemStatus.nextScheduledOptimization)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Automation Status</span>
              <span className={`font-medium ${systemStatus.isAutomated ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus.isAutomated ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      {insights.recommendations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-blue-600" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Automation Notice */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <BrainIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-900">Fully Automated System</h4>
            <p className="text-sm text-green-700">
              This pricing system operates entirely without human intervention. 
              AI algorithms continuously monitor market conditions, user behavior, 
              and performance metrics to optimize pricing automatically.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
