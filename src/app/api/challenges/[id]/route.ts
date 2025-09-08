import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch challenge with all related data
    const { data: challenge, error } = await supabase
      .from('challenges')
      .select(`
        *,
        challenge_tasks(*),
        goals(*)
      `)
      .eq('id', challengeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching challenge:', error);
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json({ data: challenge });

  } catch (error) {
    console.error('Challenge detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ 
        error: 'User ID and action are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingChallenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case 'start':
        if (existingChallenge.challenge_state !== 'planned') {
          return NextResponse.json({ 
            error: 'Challenge can only be started from planned state' 
          }, { status: 400 });
        }
        updateData = {
          challenge_state: 'running',
          started_at: new Date().toISOString()
        };
        break;

      case 'complete':
        if (existingChallenge.challenge_state !== 'running') {
          return NextResponse.json({ 
            error: 'Challenge can only be completed from running state' 
          }, { status: 400 });
        }
        updateData = {
          challenge_state: 'completed',
          completed_at: new Date().toISOString()
        };
        
        // Award XP if configured
        if (existingChallenge.reward_xp > 0) {
          await awardXP(userId, existingChallenge.reward_xp, 'challenge_completion', challengeId);
        }
        break;

      case 'fail':
        if (existingChallenge.challenge_state !== 'running') {
          return NextResponse.json({ 
            error: 'Challenge can only be failed from running state' 
          }, { status: 400 });
        }
        updateData = {
          challenge_state: 'failed',
          completed_at: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update challenge
    const { data: updatedChallenge, error: updateError } = await supabase
      .from('challenges')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating challenge:', updateError);
      return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedChallenge });

  } catch (error) {
    console.error('Challenge action API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('challenges')
      .select('id')
      .eq('id', challengeId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingChallenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Delete challenge (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting challenge:', deleteError);
      return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Challenge deleted successfully' });

  } catch (error) {
    console.error('Challenge deletion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to award XP
async function awardXP(userId: string, amount: number, sourceType: string, sourceId: string) {
  try {
    // Create XP transaction
    const { error: transactionError } = await supabase
      .from('xp_transactions')
      .insert({
        user_id: userId,
        amount,
        source_type: sourceType,
        source_id: sourceId,
        description: `Earned ${amount} XP from ${sourceType}`
      });

    if (transactionError) {
      console.error('Error creating XP transaction:', transactionError);
      return;
    }

    // Update user's total XP
    const { data: userXP, error: fetchXPError } = await supabase
      .from('user_xp')
      .select('total_xp')
      .eq('user_id', userId)
      .single();

    if (fetchXPError) {
      // Create new XP record if it doesn't exist
      const { error: createXPError } = await supabase
        .from('user_xp')
        .insert({
          user_id: userId,
          total_xp: amount,
          level: Math.floor(amount / 100) + 1
        });

      if (createXPError) {
        console.error('Error creating user XP record:', createXPError);
      }
    } else {
      // Update existing XP record
      const newTotalXP = (userXP.total_xp || 0) + amount;
      const newLevel = Math.floor(newTotalXP / 100) + 1;

      const { error: updateXPError } = await supabase
        .from('user_xp')
        .update({
          total_xp: newTotalXP,
          level: newLevel,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateXPError) {
        console.error('Error updating user XP:', updateXPError);
      }
    }
  } catch (error) {
    console.error('Error awarding XP:', error);
  }
}
