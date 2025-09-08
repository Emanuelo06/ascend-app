import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const goalId = searchParams.get('goalId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('goal_accountability')
      .select(`
        *,
        goals(title, purpose),
        partner_profile:user_profiles!goal_accountability_partner_user_id_fkey(full_name, email)
      `)
      .eq('user_id', userId);

    if (goalId) {
      query = query.eq('goal_id', goalId);
    }

    const { data: accountability, error } = await query;

    if (error) {
      console.error('Error fetching accountability partners:', error);
      return NextResponse.json({ error: 'Failed to fetch accountability partners' }, { status: 500 });
    }

    return NextResponse.json({ data: accountability });

  } catch (error) {
    console.error('Accountability API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goalId, partnerEmail, partnerUserId } = body;

    if (!userId || !goalId) {
      return NextResponse.json({ 
        error: 'User ID and goal ID are required' 
      }, { status: 400 });
    }

    if (!partnerEmail && !partnerUserId) {
      return NextResponse.json({ 
        error: 'Partner email or user ID is required' 
      }, { status: 400 });
    }

    // Verify goal ownership
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id, title')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Check if partner exists (if email provided)
    let partnerId = partnerUserId;
    if (partnerEmail && !partnerUserId) {
      const { data: partner, error: partnerError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', partnerEmail)
        .single();

      if (partnerError || !partner) {
        return NextResponse.json({ 
          error: 'Partner not found. They need to sign up first.' 
        }, { status: 404 });
      }

      partnerId = partner.id;
    }

    // Check if partnership already exists
    const { data: existingPartnership } = await supabase
      .from('goal_accountability')
      .select('id')
      .eq('user_id', userId)
      .eq('goal_id', goalId)
      .eq('partner_user_id', partnerId)
      .single();

    if (existingPartnership) {
      return NextResponse.json({ 
        error: 'Partnership already exists for this goal' 
      }, { status: 400 });
    }

    // Create accountability partnership
    const { data: partnership, error: partnershipError } = await supabase
      .from('goal_accountability')
      .insert({
        user_id: userId,
        goal_id: goalId,
        partner_user_id: partnerId,
        partner_email: partnerEmail,
        status: 'pending'
      })
      .select()
      .single();

    if (partnershipError) {
      console.error('Error creating accountability partnership:', partnershipError);
      return NextResponse.json({ error: 'Failed to create accountability partnership' }, { status: 500 });
    }

    // TODO: Send notification email to partner
    // This would integrate with your notification system

    return NextResponse.json({ data: partnership });

  } catch (error) {
    console.error('Accountability creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnershipId, userId, action } = body;

    if (!partnershipId || !userId || !action) {
      return NextResponse.json({ 
        error: 'Partnership ID, user ID, and action are required' 
      }, { status: 400 });
    }

    // Verify partnership exists and user has permission
    const { data: partnership, error: fetchError } = await supabase
      .from('goal_accountability')
      .select('*')
      .eq('id', partnershipId)
      .or(`user_id.eq.${userId},partner_user_id.eq.${userId}`)
      .single();

    if (fetchError || !partnership) {
      return NextResponse.json({ error: 'Partnership not found' }, { status: 404 });
    }

    let updateData: any = {};

    switch (action) {
      case 'accept':
        if (partnership.status !== 'pending') {
          return NextResponse.json({ 
            error: 'Partnership is not in pending status' 
          }, { status: 400 });
        }
        updateData = {
          status: 'accepted',
          responded_at: new Date().toISOString()
        };
        break;

      case 'decline':
        if (partnership.status !== 'pending') {
          return NextResponse.json({ 
            error: 'Partnership is not in pending status' 
          }, { status: 400 });
        }
        updateData = {
          status: 'declined',
          responded_at: new Date().toISOString()
        };
        break;

      case 'remove':
        updateData = {
          status: 'removed',
          responded_at: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update partnership
    const { data: updatedPartnership, error: updateError } = await supabase
      .from('goal_accountability')
      .update(updateData)
      .eq('id', partnershipId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating accountability partnership:', updateError);
      return NextResponse.json({ error: 'Failed to update partnership' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedPartnership });

  } catch (error) {
    console.error('Accountability update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnershipId = searchParams.get('partnershipId');
    const userId = searchParams.get('userId');

    if (!partnershipId || !userId) {
      return NextResponse.json({ 
        error: 'Partnership ID and user ID are required' 
      }, { status: 400 });
    }

    // Verify ownership
    const { data: partnership, error: fetchError } = await supabase
      .from('goal_accountability')
      .select('id')
      .eq('id', partnershipId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !partnership) {
      return NextResponse.json({ error: 'Partnership not found' }, { status: 404 });
    }

    // Delete partnership
    const { error: deleteError } = await supabase
      .from('goal_accountability')
      .delete()
      .eq('id', partnershipId)
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting accountability partnership:', deleteError);
      return NextResponse.json({ error: 'Failed to delete partnership' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Partnership deleted successfully' });

  } catch (error) {
    console.error('Accountability deletion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
