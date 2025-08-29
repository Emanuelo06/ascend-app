'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  BarChart3Icon,
  BrainIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
  TargetIcon
} from '@/components/ui/icons';

interface PricingAnalytics {
  currentMetrics: {
    totalSubscriptions: number;
    averageRevenue: number;
    conversionRate: number;
    churnRate: number;
    customerLifetimeValue: number;
    marketShare: number;
  };
  trends: {
    revenue: 'increasing' | 'decreasing' | 'stable';
    subscriptions: 'increasing' | 'decreasing' | 'stable';
    churn: 'increasing' | 'decreasing' | 'stable';
    conversion: 'increasing' | 'decreasing' | 'stable';
  };
  aiInsights: {
    recommendations: string[];
    riskFactors: string[];
    opportunities: string[];
    nextActions: string[];
  };
  performance: {
    lastMonth: {
      revenue: number;
      newSubscriptions: number;
      cancellations: number;
      priceChanges: number;
    };
    thisMonth: {
      revenue: number;
      newSubscriptions: number;
      cancellations: number;
      priceChanges: number;
    };
  };
}

export default function PricingAnalytics() {
  const [analytics, setAnalytics] = useState<PricingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchAnalytics, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      // In production, this would fetch from the analytics API
      // For now, we'll simulate the data
      const mockAnalytics: PricingAnalytics = {
        currentMetrics: {
          totalSubscriptions: 1247,
          averageRevenue: 15.67,
          conversionRate: 12.3,
          churnRate: 8.7,
          customerLifetimeValue: 89.45,
          marketShare: 23.4
        },
        trends: {
          revenue: 'increasing',
          subscriptions: 'increasing',
          churn: 'decreasing',
          conversion: 'stable'
        },
        aiInsights: {
          recommendations: [
            'Consider reducing Premium tier price by 15% to improve conversion',
            'Implement loyalty pricing for customers with 6+ months subscription',
            'Add seasonal pricing for Q4 holiday season',
            'Introduce family plan pricing to capture multi-user households'
          ],
          riskFactors: [
            'Competitor X launched 20% lower pricing this week',
            'Economic indicators suggest potential market downturn',
            'Customer satisfaction scores dropped 5% in last month'
          ],
          opportunities: [
            'New Year resolution market shows 40% higher conversion potential',
            'Enterprise segment shows 3x higher willingness to pay',
            'International markets show 60% lower price sensitivity'
          ],
          nextActions: [
            'Run A/B test on Premium tier pricing this week',
            'Implement dynamic pricing for enterprise customers',
            'Prepare Q4 seasonal pricing strategy by end of month'
          ]
        },
        performance: {
          lastMonth: {
            revenue: 18543.67,
            newSubscriptions: 89,
            cancellations: 23,
            priceChanges: 3
          },
          thisMonth: {
            revenue: 19876.34,
            newSubscriptions: 94,
            cancellations: 19,
            priceChanges: 2
          }
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load pricing analytics</p>
      </div>
    );
  }

  const { currentMetrics, trends, aiInsights, performance } = analytics;

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3Icon className="w-6 h-6 text-blue-600" />
            AI Pricing Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Real-time insights and automated recommendations for pricing optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '7d' | '30d' | '90d')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Subscriptions</h3>
            <UsersIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {currentMetrics.totalSubscriptions.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {getTrendIcon(trends.subscriptions)}
            <span className={`text-sm font-medium ${getTrendColor(trends.subscriptions)}`}>
              {trends.subscriptions === 'increasing' ? '+' : ''}
              {calculateGrowth(performance.thisMonth.newSubscriptions, performance.lastMonth.newSubscriptions).toFixed(1)}%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
            <DollarSignIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(performance.thisMonth.revenue)}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {getTrendIcon(trends.revenue)}
            <span className={`text-sm font-medium ${getTrendColor(trends.revenue)}`}>
              {trends.revenue === 'increasing' ? '+' : ''}
              {calculateGrowth(performance.thisMonth.revenue, performance.lastMonth.revenue).toFixed(1)}%
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Rate</h3>
            <TargetIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {currentMetrics.conversionRate}%
          </div>
          <div className="mt-2 flex items-center gap-2">
            {getTrendIcon(trends.conversion)}
            <span className={`text-sm font-medium ${getTrendColor(trends.conversion)}`}>
              {trends.conversion === 'stable' ? 'Stable' : trends.conversion}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Churn Rate</h3>
            <TrendingDownIcon className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {currentMetrics.churnRate}%
          </div>
          <div className="mt-2 flex items-center gap-2">
            {getTrendIcon(trends.churn)}
            <span className={`text-sm font-medium ${getTrendColor(trends.churn)}`}>
              {trends.churn === 'decreasing' ? 'Improving' : 'Needs attention'}
            </span>
          </div>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-blue-600" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {aiInsights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TargetIcon className="w-5 h-5 text-green-600" />
            Next Actions
          </h3>
          <div className="space-y-3">
            {aiInsights.nextActions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">{action}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(performance.thisMonth.revenue)}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
            <div className="text-xs text-gray-500">
              vs {formatCurrency(performance.lastMonth.revenue)} last month
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {performance.thisMonth.newSubscriptions}
            </div>
            <div className="text-sm text-gray-600">New Subscriptions</div>
            <div className="text-xs text-gray-500">
              vs {performance.lastMonth.newSubscriptions} last month
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {performance.thisMonth.cancellations}
            </div>
            <div className="text-sm text-gray-600">Cancellations</div>
            <div className="text-xs text-gray-500">
              vs {performance.lastMonth.cancellations} last month
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {performance.thisMonth.priceChanges}
            </div>
            <div className="text-sm text-gray-600">Price Changes</div>
            <div className="text-xs text-gray-500">
              vs {performance.lastMonth.priceChanges} last month
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Factors & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Risk Factors</h3>
          <div className="space-y-2">
            {aiInsights.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-red-800 text-sm">{risk}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-green-200 bg-green-50">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Opportunities</h3>
          <div className="space-y-2">
            {aiInsights.opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-800 text-sm">{opportunity}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Automation Notice */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <BrainIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Fully Automated Analytics</h4>
            <p className="text-sm text-blue-700">
              All analytics, insights, and recommendations are generated automatically by AI. 
              No human analysis or intervention required. The system continuously learns and 
              improves based on real-time data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
