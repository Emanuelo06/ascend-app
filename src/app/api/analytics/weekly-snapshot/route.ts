import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get('weekStart');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Calculate week start if not provided (default to current week)
    const currentWeekStart = weekStart 
      ? new Date(weekStart)
      : new Date();
    
    // Get Monday of current week
    const dayOfWeek = currentWeekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStartDate = new Date(currentWeekStart);
    weekStartDate.setDate(currentWeekStart.getDate() + mondayOffset);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekStartStr = weekStartDate.toISOString().split('T')[0];

    // Check if snapshot already exists
    const { data: existingSnapshot, error: fetchError } = await supabase
      .from('weekly_snapshots')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start', weekStartStr)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching weekly snapshot:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch weekly snapshot' }, { status: 500 });
    }

    // If snapshot exists and is recent (within last hour), return it
    if (existingSnapshot && existingSnapshot.updated_at) {
      const updatedAt = new Date(existingSnapshot.updated_at);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (updatedAt > oneHourAgo) {
        return NextResponse.json({ data: existingSnapshot });
      }
    }

    // Calculate new snapshot using the database function
    const { data: snapshotData, error: calcError } = await supabase
      .rpc('calculate_weekly_snapshot', {
        p_user_id: userId,
        p_week_start: weekStartStr
      });

    if (calcError) {
      console.error('Error calculating weekly snapshot:', calcError);
      return NextResponse.json({ error: 'Failed to calculate weekly snapshot' }, { status: 500 });
    }

    if (!snapshotData || snapshotData.length === 0) {
      return NextResponse.json({ error: 'No data found for the specified week' }, { status: 404 });
    }

    const snapshot = snapshotData[0];
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    // Prepare snapshot data
    const snapshotRecord = {
      user_id: userId,
      week_start: weekStartStr,
      week_end: weekEndDate.toISOString().split('T')[0],
      completion_percentage: snapshot.completion_percentage,
      total_habits: snapshot.total_habits,
      completed_habits: snapshot.completed_habits,
      current_streak: snapshot.current_streak,
      best_streak: snapshot.best_streak,
      avg_mood: snapshot.avg_mood,
      avg_energy: snapshot.avg_energy,
      best_moment: snapshot.best_moment,
      worst_moment: snapshot.worst_moment,
      top_habits: snapshot.top_habits,
      struggling_habits: snapshot.struggling_habits,
      ai_summary: existingSnapshot?.ai_summary || null,
      ai_insights: existingSnapshot?.ai_insights || []
    };

    // Upsert the snapshot
    const { data: savedSnapshot, error: saveError } = await supabase
      .from('weekly_snapshots')
      .upsert(snapshotRecord, { 
        onConflict: 'user_id,week_start',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving weekly snapshot:', saveError);
      return NextResponse.json({ error: 'Failed to save weekly snapshot' }, { status: 500 });
    }

    return NextResponse.json({ data: savedSnapshot });

  } catch (error) {
    console.error('Weekly snapshot API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, weekStart, forceRegenerate = false } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Calculate week start
    const currentWeekStart = weekStart ? new Date(weekStart) : new Date();
    const dayOfWeek = currentWeekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStartDate = new Date(currentWeekStart);
    weekStartDate.setDate(currentWeekStart.getDate() + mondayOffset);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekStartStr = weekStartDate.toISOString().split('T')[0];

    // Force regenerate or create new snapshot
    if (forceRegenerate) {
      // Delete existing snapshot
      await supabase
        .from('weekly_snapshots')
        .delete()
        .eq('user_id', userId)
        .eq('week_start', weekStartStr);
    }

    // Generate new snapshot
    const { data: snapshotData, error: calcError } = await supabase
      .rpc('calculate_weekly_snapshot', {
        p_user_id: userId,
        p_week_start: weekStartStr
      });

    if (calcError) {
      console.error('Error calculating weekly snapshot:', calcError);
      return NextResponse.json({ error: 'Failed to calculate weekly snapshot' }, { status: 500 });
    }

    if (!snapshotData || snapshotData.length === 0) {
      return NextResponse.json({ error: 'No data found for the specified week' }, { status: 404 });
    }

    const snapshot = snapshotData[0];
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    // Generate AI summary if not exists
    let aiSummary = null;
    let aiInsights = [];

    if (!snapshot.ai_summary || forceRegenerate) {
      try {
        // Call AI API to generate summary
        const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/ai/weekly-summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            weekStart: weekStartStr,
            snapshotData: snapshot
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiSummary = aiData.summary;
          aiInsights = aiData.insights || [];
        }
      } catch (aiError) {
        console.error('AI summary generation failed:', aiError);
        // Continue without AI summary
      }
    }

    // Prepare snapshot data
    const snapshotRecord = {
      user_id: userId,
      week_start: weekStartStr,
      week_end: weekEndDate.toISOString().split('T')[0],
      completion_percentage: snapshot.completion_percentage,
      total_habits: snapshot.total_habits,
      completed_habits: snapshot.completed_habits,
      current_streak: snapshot.current_streak,
      best_streak: snapshot.best_streak,
      avg_mood: snapshot.avg_mood,
      avg_energy: snapshot.avg_energy,
      best_moment: snapshot.best_moment,
      worst_moment: snapshot.worst_moment,
      top_habits: snapshot.top_habits,
      struggling_habits: snapshot.struggling_habits,
      ai_summary: aiSummary,
      ai_insights: aiInsights
    };

    // Upsert the snapshot
    const { data: savedSnapshot, error: saveError } = await supabase
      .from('weekly_snapshots')
      .upsert(snapshotRecord, { 
        onConflict: 'user_id,week_start',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving weekly snapshot:', saveError);
      return NextResponse.json({ error: 'Failed to save weekly snapshot' }, { status: 500 });
    }

    return NextResponse.json({ data: savedSnapshot });

  } catch (error) {
    console.error('Weekly snapshot generation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
