import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeTransactions = searchParams.get('includeTransactions') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user XP data
    const { data: userXP, error: xpError } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (xpError && xpError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user XP:', xpError);
      return NextResponse.json({ error: 'Failed to fetch user XP' }, { status: 500 });
    }

    // If no XP record exists, create one
    if (!userXP) {
      const { data: newXP, error: createError } = await supabase
        .from('user_xp')
        .insert({
          user_id: userId,
          total_xp: 0,
          level: 1,
          badges: []
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user XP record:', createError);
        return NextResponse.json({ error: 'Failed to create user XP record' }, { status: 500 });
      }

      return NextResponse.json({ data: newXP });
    }

    // Get recent transactions if requested
    if (includeTransactions) {
      const { data: transactions, error: transactionsError } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transactionsError) {
        console.error('Error fetching XP transactions:', transactionsError);
      } else {
        userXP.recent_transactions = transactions || [];
      }
    }

    return NextResponse.json({ data: userXP });

  } catch (error) {
    console.error('User XP API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, sourceType, sourceId, description } = body;

    if (!userId || !amount || !sourceType) {
      return NextResponse.json({ 
        error: 'User ID, amount, and source type are required' 
      }, { status: 400 });
    }

    // Create XP transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('xp_transactions')
      .insert({
        user_id: userId,
        amount,
        source_type: sourceType,
        source_id: sourceId,
        description: description || `Earned ${amount} XP from ${sourceType}`
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating XP transaction:', transactionError);
      return NextResponse.json({ error: 'Failed to create XP transaction' }, { status: 500 });
    }

    // Update user's total XP
    const { data: userXP, error: fetchXPError } = await supabase
      .from('user_xp')
      .select('total_xp, level')
      .eq('user_id', userId)
      .single();

    if (fetchXPError) {
      // Create new XP record if it doesn't exist
      const { data: newXP, error: createXPError } = await supabase
        .from('user_xp')
        .insert({
          user_id: userId,
          total_xp: amount,
          level: Math.floor(amount / 100) + 1
        })
        .select()
        .single();

      if (createXPError) {
        console.error('Error creating user XP record:', createXPError);
        return NextResponse.json({ error: 'Failed to create user XP record' }, { status: 500 });
      }

      return NextResponse.json({ data: { transaction, userXP: newXP } });
    } else {
      // Update existing XP record
      const newTotalXP = (userXP.total_xp || 0) + amount;
      const newLevel = Math.floor(newTotalXP / 100) + 1;
      const levelUp = newLevel > (userXP.level || 1);

      const { data: updatedXP, error: updateXPError } = await supabase
        .from('user_xp')
        .update({
          total_xp: newTotalXP,
          level: newLevel,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateXPError) {
        console.error('Error updating user XP:', updateXPError);
        return NextResponse.json({ error: 'Failed to update user XP' }, { status: 500 });
      }

      return NextResponse.json({ 
        data: { 
          transaction, 
          userXP: updatedXP,
          levelUp,
          previousLevel: userXP.level || 1
        } 
      });
    }

  } catch (error) {
    console.error('XP transaction API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, badges } = body;

    if (!userId || !Array.isArray(badges)) {
      return NextResponse.json({ 
        error: 'User ID and badges array are required' 
      }, { status: 400 });
    }

    // Update user badges
    const { data: updatedXP, error: updateError } = await supabase
      .from('user_xp')
      .update({
        badges: badges,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user badges:', updateError);
      return NextResponse.json({ error: 'Failed to update user badges' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedXP });

  } catch (error) {
    console.error('User badges update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
