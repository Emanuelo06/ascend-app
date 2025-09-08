import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30'; // days

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Calculate date range
    const endDateObj = endDate ? new Date(endDate) : new Date();
    const startDateObj = startDate 
      ? new Date(startDate) 
      : new Date(endDateObj.getTime() - (parseInt(period) * 24 * 60 * 60 * 1000));

    const startDateStr = startDateObj.toISOString().split('T')[0];
    const endDateStr = endDateObj.toISOString().split('T')[0];

    // Get daily progress data
    const { data: heatmapData, error: heatmapError } = await supabase
      .from('daily_progress_heatmap')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .order('date', { ascending: true });

    if (heatmapError) {
      console.error('Error fetching heatmap data:', heatmapError);
      return NextResponse.json({ error: 'Failed to fetch heatmap data' }, { status: 500 });
    }

    // If no heatmap data exists, generate it from habit checkins
    if (!heatmapData || heatmapData.length === 0) {
      const generatedData = await generateHeatmapData(userId, startDateStr, endDateStr);
      return NextResponse.json({ data: generatedData });
    }

    // Format data for frontend
    const formattedData = heatmapData.map(day => ({
      date: day.date,
      completion_percentage: day.completion_percentage,
      total_habits: day.total_habits,
      completed_habits: day.completed_habits,
      partial_habits: day.partial_habits,
      missed_habits: day.missed_habits,
      mood_score: day.mood_score,
      energy_level: day.energy_level,
      notes: day.notes,
      status: getDayStatus(day.completion_percentage)
    }));

    return NextResponse.json({ data: formattedData });

  } catch (error) {
    console.error('Progress heatmap API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, moodScore, energyLevel, notes } = body;

    if (!userId || !date) {
      return NextResponse.json({ error: 'User ID and date are required' }, { status: 400 });
    }

    // Get or create daily progress record
    const { data: existingRecord, error: fetchError } = await supabase
      .from('daily_progress_heatmap')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching daily progress:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch daily progress' }, { status: 500 });
    }

    // Calculate completion data for the day
    const completionData = await calculateDayCompletion(userId, date);

    const progressData = {
      user_id: userId,
      date,
      ...completionData,
      mood_score: moodScore || existingRecord?.mood_score || null,
      energy_level: energyLevel || existingRecord?.energy_level || null,
      notes: notes || existingRecord?.notes || null
    };

    // Upsert the record
    const { data: savedRecord, error: saveError } = await supabase
      .from('daily_progress_heatmap')
      .upsert(progressData, { 
        onConflict: 'user_id,date',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving daily progress:', saveError);
      return NextResponse.json({ error: 'Failed to save daily progress' }, { status: 500 });
    }

    return NextResponse.json({ data: savedRecord });

  } catch (error) {
    console.error('Daily progress API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate heatmap data from habit checkins
async function generateHeatmapData(userId: string, startDate: string, endDate: string) {
  const { data: checkins, error } = await supabase
    .from('habit_checkins')
    .select(`
      date,
      status,
      habit_id,
      habits!inner(title, moment)
    `)
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching checkins for heatmap:', error);
    return [];
  }

  // Get total habits for the user
  const { data: habits } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('archived', false);

  const totalHabits = habits?.length || 0;

  // Group checkins by date
  const checkinsByDate = checkins?.reduce((acc, checkin) => {
    const date = checkin.date;
    if (!acc[date]) {
      acc[date] = { done: 0, partial: 0, skipped: 0 };
    }
    acc[date][checkin.status]++;
    return acc;
  }, {} as Record<string, { done: number; partial: number; skipped: number }>) || {};

  // Generate heatmap data
  const heatmapData = [];
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayCheckins = checkinsByDate[dateStr] || { done: 0, partial: 0, skipped: 0 };
    
    const completedHabits = dayCheckins.done;
    const partialHabits = dayCheckins.partial;
    const missedHabits = totalHabits - completedHabits - partialHabits;
    const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    heatmapData.push({
      date: dateStr,
      completion_percentage: completionPercentage,
      total_habits: totalHabits,
      completed_habits: completedHabits,
      partial_habits: partialHabits,
      missed_habits: Math.max(0, missedHabits),
      mood_score: null,
      energy_level: null,
      notes: null,
      status: getDayStatus(completionPercentage)
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return heatmapData;
}

// Helper function to calculate day completion
async function calculateDayCompletion(userId: string, date: string) {
  const { data: checkins } = await supabase
    .from('habit_checkins')
    .select('status')
    .eq('user_id', userId)
    .eq('date', date);

  const { data: habits } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('archived', false);

  const totalHabits = habits?.length || 0;
  const completedHabits = checkins?.filter(c => c.status === 'done').length || 0;
  const partialHabits = checkins?.filter(c => c.status === 'partial').length || 0;
  const missedHabits = Math.max(0, totalHabits - completedHabits - partialHabits);
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return {
    total_habits: totalHabits,
    completed_habits: completedHabits,
    partial_habits: partialHabits,
    missed_habits: missedHabits,
    completion_percentage: completionPercentage
  };
}

// Helper function to determine day status
function getDayStatus(completionPercentage: number): 'excellent' | 'good' | 'partial' | 'poor' {
  if (completionPercentage >= 80) return 'excellent';
  if (completionPercentage >= 60) return 'good';
  if (completionPercentage >= 30) return 'partial';
  return 'poor';
}
