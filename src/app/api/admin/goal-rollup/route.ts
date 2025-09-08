import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, forceRecalculate = false } = body;

    // This endpoint should be protected in production
    // For now, we'll allow it for development

    if (userId) {
      // Process specific user
      await processUserGoals(userId, forceRecalculate);
    } else {
      // Process all active users
      await processAllUsersGoals(forceRecalculate);
    }

    return NextResponse.json({ 
      message: 'Goal rollup completed successfully',
      processed: userId ? 'single user' : 'all users'
    });

  } catch (error) {
    console.error('Goal rollup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processUserGoals(userId: string, forceRecalculate: boolean = false) {
  try {
    console.log(`Processing goals for user: ${userId}`);

    // Get all active goals for the user
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('state', 'active');

    if (goalsError) {
      console.error('Error fetching user goals:', goalsError);
      return;
    }

    if (!goals || goals.length === 0) {
      console.log(`No active goals found for user: ${userId}`);
      return;
    }

    const currentWeek = getCurrentISOWeek();
    const lastWeek = getPreviousISOWeek();

    for (const goal of goals) {
      await processGoalProgress(goal, currentWeek, lastWeek, forceRecalculate);
    }

    console.log(`Completed processing ${goals.length} goals for user: ${userId}`);

  } catch (error) {
    console.error(`Error processing goals for user ${userId}:`, error);
  }
}

async function processAllUsersGoals(forceRecalculate: boolean = false) {
  try {
    console.log('Processing goals for all users');

    // Get all users with active goals
    const { data: users, error: usersError } = await supabase
      .from('goals')
      .select('user_id')
      .eq('state', 'active')
      .not('user_id', 'is', null);

    if (usersError) {
      console.error('Error fetching users with goals:', usersError);
      return;
    }

    const uniqueUserIds = [...new Set(users?.map(u => u.user_id) || [])];
    
    for (const userId of uniqueUserIds) {
      await processUserGoals(userId, forceRecalculate);
    }

    console.log(`Completed processing goals for ${uniqueUserIds.length} users`);

  } catch (error) {
    console.error('Error processing all users goals:', error);
  }
}

async function processGoalProgress(goal: any, currentWeek: string, lastWeek: string, forceRecalculate: boolean) {
  try {
    // Check if we already have a snapshot for this week
    if (!forceRecalculate) {
      const { data: existingSnapshot } = await supabase
        .from('goal_snapshots')
        .select('id')
        .eq('goal_id', goal.id)
        .eq('iso_week', currentWeek)
        .single();

      if (existingSnapshot) {
        console.log(`Snapshot already exists for goal ${goal.id}, week ${currentWeek}`);
        return;
      }
    }

    // Calculate current progress
    const { data: currentProgress } = await supabase
      .rpc('calculate_goal_progress', {
        p_goal_id: goal.id
      });

    // Calculate momentum (vs previous week)
    let momentum = 0;
    const { data: lastWeekSnapshot } = await supabase
      .from('goal_snapshots')
      .select('progress_pct')
      .eq('goal_id', goal.id)
      .eq('iso_week', lastWeek)
      .single();

    if (lastWeekSnapshot && lastWeekSnapshot.progress_pct > 0) {
      momentum = ((currentProgress || 0) - lastWeekSnapshot.progress_pct) / lastWeekSnapshot.progress_pct * 100;
    }

    // Calculate average effort from habit metrics
    const { data: effortData } = await supabase
      .from('goal_habits')
      .select(`
        habits(
          habit_metrics(ema30)
        )
      `)
      .eq('goal_id', goal.id);

    let avgEffort = 0.5; // default
    if (effortData && effortData.length > 0) {
      const efforts = effortData
        .map(gh => gh.habits?.habit_metrics?.ema30)
        .filter(e => e !== null && e !== undefined);
      
      if (efforts.length > 0) {
        avgEffort = efforts.reduce((sum, e) => sum + e, 0) / efforts.length;
      }
    }

    // Calculate health
    const { data: healthData } = await supabase
      .rpc('calculate_goal_health', {
        p_goal_id: goal.id
      });

    // Create or update snapshot
    const snapshotData = {
      user_id: goal.user_id,
      goal_id: goal.id,
      iso_week: currentWeek,
      progress_pct: currentProgress || 0,
      momentum: momentum,
      avg_effort: avgEffort,
      ai_summary: {} // Will be populated by AI job if needed
    };

    const { error: snapshotError } = await supabase
      .from('goal_snapshots')
      .upsert(snapshotData, {
        onConflict: 'goal_id,iso_week'
      });

    if (snapshotError) {
      console.error('Error creating goal snapshot:', snapshotError);
      return;
    }

    // Update goal with current progress and health
    const { error: goalUpdateError } = await supabase
      .from('goals')
      .update({
        progress_pct: currentProgress || 0,
        health: healthData || 'green',
        updated_at: new Date().toISOString()
      })
      .eq('id', goal.id);

    if (goalUpdateError) {
      console.error('Error updating goal progress:', goalUpdateError);
    }

    // Check if we need to trigger AI suggestions
    const shouldTriggerAI = (
      momentum < -20 || // Significant drop
      (healthData === 'red') || // Poor health
      (currentProgress || 0) < 30 // Very low progress
    );

    if (shouldTriggerAI) {
      await triggerAISuggestions(goal.id, goal.user_id);
    }

    console.log(`Processed goal ${goal.id}: progress=${currentProgress}%, momentum=${momentum.toFixed(1)}%, health=${healthData}`);

  } catch (error) {
    console.error(`Error processing goal ${goal.id}:`, error);
  }
}

async function triggerAISuggestions(goalId: string, userId: string) {
  try {
    // Check if user has AI opt-in
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    const aiOptIn = userProfile?.preferences?.ai_opt_in !== false; // default to true

    if (!aiOptIn) {
      console.log(`User ${userId} has not opted into AI suggestions`);
      return;
    }

    // Check if we already have recent suggestions for this goal
    const { data: recentSuggestions } = await supabase
      .from('goal_ai_suggestions')
      .select('id')
      .eq('goal_id', goalId)
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // last 24 hours
      .is('applied_at', null)
      .is('dismissed_at', null);

    if (recentSuggestions && recentSuggestions.length > 0) {
      console.log(`Recent suggestions already exist for goal ${goalId}`);
      return;
    }

    // Generate AI suggestions (this would call your AI service)
    await generateGoalAISuggestions(goalId, userId);

  } catch (error) {
    console.error(`Error triggering AI suggestions for goal ${goalId}:`, error);
  }
}

async function generateGoalAISuggestions(goalId: string, userId: string) {
  try {
    // This is a placeholder for AI suggestion generation
    // In a real implementation, you would:
    // 1. Fetch goal data and recent checkins
    // 2. Call your AI service (OpenAI, Anthropic, etc.)
    // 3. Parse the response and create suggestions
    
    console.log(`Generating AI suggestions for goal ${goalId}`);
    
    // For now, create a sample suggestion
    const sampleSuggestion = {
      user_id: userId,
      goal_id: goalId,
      suggestion_type: 'move_time',
      short_text: 'Try morning routine',
      rationale: 'You were 80% successful when you logged before 08:00',
      estimated_effort: 'low',
      projected_impact: 'medium',
      payload: { time_shift: '15 minutes earlier' },
      evidence: 'Based on last 7 days, you hit 80% when you do X after Y',
      confidence_score: 0.7
    };

    const { error: suggestionError } = await supabase
      .from('goal_ai_suggestions')
      .insert(sampleSuggestion);

    if (suggestionError) {
      console.error('Error creating AI suggestion:', suggestionError);
    } else {
      console.log(`Created AI suggestion for goal ${goalId}`);
    }

  } catch (error) {
    console.error(`Error generating AI suggestions for goal ${goalId}:`, error);
  }
}

function getCurrentISOWeek(): string {
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getPreviousISOWeek(): string {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const year = lastWeek.getFullYear();
  const week = getWeekNumber(lastWeek);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
