import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const goalId = searchParams.get('goalId');
    const includeApplied = searchParams.get('includeApplied') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('goal_ai_suggestions')
      .select(`
        *,
        goals(title, purpose)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    if (!includeApplied) {
      query = query.is('applied_at', null).is('dismissed_at', null);
    }

    const { data: suggestions, error } = await query;

    if (error) {
      console.error('Error fetching AI suggestions:', error);
      return NextResponse.json({ error: 'Failed to fetch AI suggestions' }, { status: 500 });
    }

    return NextResponse.json({ data: suggestions });

  } catch (error) {
    console.error('AI suggestions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      goalId,
      suggestionType,
      shortText,
      rationale,
      estimatedEffort,
      projectedImpact,
      payload = {},
      evidence,
      confidenceScore = 0.5
    } = body;

    if (!userId || !goalId || !suggestionType || !shortText || !rationale || !evidence) {
      return NextResponse.json({ 
        error: 'User ID, goal ID, suggestion type, short text, rationale, and evidence are required' 
      }, { status: 400 });
    }

    // Verify goal ownership
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Create AI suggestion
    const { data: suggestion, error: suggestionError } = await supabase
      .from('goal_ai_suggestions')
      .insert({
        user_id: userId,
        goal_id: goalId,
        suggestion_type: suggestionType,
        short_text: shortText,
        rationale: rationale,
        estimated_effort: estimatedEffort,
        projected_impact: projectedImpact,
        payload: payload,
        evidence: evidence,
        confidence_score: confidenceScore
      })
      .select()
      .single();

    if (suggestionError) {
      console.error('Error creating AI suggestion:', suggestionError);
      return NextResponse.json({ error: 'Failed to create AI suggestion' }, { status: 500 });
    }

    return NextResponse.json({ data: suggestion });

  } catch (error) {
    console.error('AI suggestion creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { suggestionId, userId, action, updates = {} } = body;

    if (!suggestionId || !userId || !action) {
      return NextResponse.json({ 
        error: 'Suggestion ID, user ID, and action are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: existingSuggestion, error: fetchError } = await supabase
      .from('goal_ai_suggestions')
      .select('*')
      .eq('id', suggestionId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingSuggestion) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    let updateData: any = { ...updates };

    switch (action) {
      case 'apply':
        if (existingSuggestion.applied_at) {
          return NextResponse.json({ 
            error: 'Suggestion has already been applied' 
          }, { status: 400 });
        }
        updateData.applied_at = new Date().toISOString();
        break;

      case 'dismiss':
        if (existingSuggestion.dismissed_at) {
          return NextResponse.json({ 
            error: 'Suggestion has already been dismissed' 
          }, { status: 400 });
        }
        updateData.dismissed_at = new Date().toISOString();
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update suggestion
    const { data: updatedSuggestion, error: updateError } = await supabase
      .from('goal_ai_suggestions')
      .update(updateData)
      .eq('id', suggestionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating AI suggestion:', updateError);
      return NextResponse.json({ error: 'Failed to update AI suggestion' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedSuggestion });

  } catch (error) {
    console.error('AI suggestion update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
