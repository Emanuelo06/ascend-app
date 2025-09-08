import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weekStart, snapshotData } = body;

    if (!userId || !snapshotData) {
      return NextResponse.json({ error: 'User ID and snapshot data are required' }, { status: 400 });
    }

    // Generate AI summary based on snapshot data
    const summary = generateWeeklySummary(snapshotData);
    const insights = generateAIInsights(snapshotData);

    return NextResponse.json({
      summary,
      insights
    });

  } catch (error) {
    console.error('AI weekly summary API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate weekly summary
function generateWeeklySummary(snapshot: any): string {
  const { completion_percentage, current_streak, best_streak, best_moment, worst_moment, total_habits, completed_habits } = snapshot;

  let summary = '';

  // Opening based on completion rate
  if (completion_percentage >= 80) {
    summary += `Excellent week! You completed ${completion_percentage}% of your habits (${completed_habits}/${total_habits}). `;
  } else if (completion_percentage >= 60) {
    summary += `Good progress this week with ${completion_percentage}% completion (${completed_habits}/${total_habits}). `;
  } else if (completion_percentage >= 40) {
    summary += `This week was challenging with ${completion_percentage}% completion (${completed_habits}/${total_habits}). `;
  } else {
    summary += `This week was tough with ${completion_percentage}% completion (${completed_habits}/${total_habits}). `;
  }

  // Streak information
  if (current_streak > 0) {
    if (current_streak >= best_streak) {
      summary += `You're on a ${current_streak}-day streak - your best yet! `;
    } else {
      summary += `You're rebuilding with a ${current_streak}-day streak. `;
    }
  } else {
    summary += `Time to restart your streak. `;
  }

  // Moment-based insights
  if (best_moment && worst_moment && best_moment !== worst_moment) {
    summary += `${best_moment.charAt(0).toUpperCase() + best_moment.slice(1)}s are your strength, while ${worst_moment}s need attention. `;
  }

  // Closing encouragement
  if (completion_percentage >= 70) {
    summary += 'Keep up the great work!';
  } else {
    summary += 'Focus on small wins and consistency over perfection.';
  }

  return summary;
}

// Helper function to generate AI insights
function generateAIInsights(snapshot: any): any[] {
  const insights = [];
  const { completion_percentage, current_streak, best_streak, best_moment, worst_moment, struggling_habits } = snapshot;

  // Insight 1: Completion rate analysis
  if (completion_percentage < 50) {
    insights.push({
      type: 'opportunity',
      title: 'Focus on consistency',
      description: 'Your completion rate is below 50%. Start with your easiest habits to build momentum.',
      action: 'Reduce habit difficulty or move challenging habits to your best time of day.',
      priority: 'high'
    });
  } else if (completion_percentage > 80) {
    insights.push({
      type: 'achievement',
      title: 'Ready for a challenge',
      description: 'Excellent consistency! You\'re ready to add new habits or increase difficulty.',
      action: 'Consider adding a new habit or increasing the challenge of existing ones.',
      priority: 'medium'
    });
  }

  // Insight 2: Streak analysis
  if (current_streak > 0 && current_streak < best_streak) {
    insights.push({
      type: 'pattern',
      title: 'Streak recovery',
      description: `You're rebuilding your streak (${current_streak} days). Focus on consistency over perfection.`,
      action: 'Set a micro-goal to reach your previous best streak.',
      priority: 'medium'
    });
  }

  // Insight 3: Time-based optimization
  if (best_moment && worst_moment && best_moment !== worst_moment) {
    insights.push({
      type: 'optimization',
      title: `Optimize ${worst_moment} routine`,
      description: `Your ${best_moment} habits are strong, but ${worst_moment} habits need attention.`,
      action: `Consider moving some ${worst_moment} habits to ${best_moment} or reducing their difficulty.`,
      priority: 'medium'
    });
  }

  // Insight 4: Habit-specific recommendations
  if (struggling_habits && struggling_habits.length > 0) {
    insights.push({
      type: 'habit',
      title: 'Focus on struggling habits',
      description: `You have ${struggling_habits.length} habit(s) that need attention this week.`,
      action: 'Review these habits and consider adjusting their timing, difficulty, or breaking them into smaller steps.',
      priority: 'high'
    });
  }

  return insights;
}
