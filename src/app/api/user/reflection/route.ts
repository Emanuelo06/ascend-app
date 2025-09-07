import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// GET /api/user/reflection - Get user's reflections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date'); // Optional: specific date
    const range = searchParams.get('range'); // Optional: date range (e.g., "7d", "30d")

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (date) {
      query = query.eq('date', date);
    } else if (range) {
      const endDate = new Date();
      const startDate = new Date();
      
      if (range === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (range === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      }
      
      query = query.gte('date', startDate.toISOString().split('T')[0])
                   .lte('date', endDate.toISOString().split('T')[0]);
    } else {
      // Default to last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      query = query.gte('date', startDate.toISOString().split('T')[0])
                   .lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data: reflections, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch reflections: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data: reflections || [],
      count: reflections?.length || 0
    });

  } catch (error) {
    console.error('Error fetching reflections:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reflections',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/user/reflection - Create or update daily reflection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      date, 
      mood, 
      energy, 
      gratitude, 
      challenges, 
      wins, 
      tomorrowFocus,
      sleepHours,
      stressLevel,
      productivity
    } = body;

    // Validate required fields
    if (!userId || !date) {
      return NextResponse.json(
        { 
          error: 'User ID and date are required',
          required: ['userId', 'date']
        },
        { status: 400 }
      );
    }

    // Validate mood (1-10 scale)
    if (mood && (mood < 1 || mood > 10)) {
      return NextResponse.json(
        { error: 'Mood must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Validate energy (1-10 scale)
    if (energy && (energy < 1 || energy > 10)) {
      return NextResponse.json(
        { error: 'Energy must be between 1 and 10' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    
    // Check if reflection already exists for this date
    const { data: existingReflection } = await supabase
      .from('daily_reflections')
      .select('id')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    let result;
    
    if (existingReflection) {
      // Update existing reflection
      const { data, error } = await supabase
        .from('daily_reflections')
        .update({
          mood,
          energy,
          gratitude,
          challenges,
          wins,
          tomorrow_focus: tomorrowFocus,
          sleep_hours: sleepHours,
          stress_level: stressLevel,
          productivity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReflection.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update reflection: ${error.message}`);
      result = data;
    } else {
      // Create new reflection
      const { data, error } = await supabase
        .from('daily_reflections')
        .insert({
          user_id: userId,
          date,
          mood,
          energy,
          gratitude,
          challenges,
          wins,
          tomorrow_focus: tomorrowFocus,
          sleep_hours: sleepHours,
          stress_level: stressLevel,
          productivity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create reflection: ${error.message}`);
      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: existingReflection ? 'Reflection updated successfully' : 'Reflection created successfully'
    }, { status: existingReflection ? 200 : 201 });

  } catch (error) {
    console.error('Error saving reflection:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save reflection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
