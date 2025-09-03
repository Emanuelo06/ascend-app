import { NextRequest, NextResponse } from 'next/server';
import { habitEngine } from '@/lib/habit-engine';
import { HabitCheckin } from '@/types';

// Mock database for demo - replace with real database calls
let checkins: HabitCheckin[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { habitId, date, status, effort, doseActual, note } = body;

    // Validate required fields
    if (!habitId || !date || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: habitId, date, status' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['done', 'partial', 'skipped'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: done, partial, or skipped' },
        { status: 400 }
      );
    }

    // Validate effort (0-3)
    if (effort !== undefined && (effort < 0 || effort > 3)) {
      return NextResponse.json(
        { error: 'Effort must be between 0 and 3' },
        { status: 400 }
      );
    }

    // Check if checkin already exists for this habit and date
    const existingCheckinIndex = checkins.findIndex(
      c => c.habitId === habitId && c.date === date
    );

    if (existingCheckinIndex !== -1) {
      // Update existing checkin (idempotent)
      const updatedCheckin: HabitCheckin = {
        ...checkins[existingCheckinIndex],
        status,
        effort: effort ?? checkins[existingCheckinIndex].effort,
        doseActual: doseActual ?? checkins[existingCheckinIndex].doseActual,
        note: note ?? checkins[existingCheckinIndex].note,
        editedAt: new Date().toISOString()
      };

      checkins[existingCheckinIndex] = updatedCheckin;

      return NextResponse.json({
        success: true,
        data: updatedCheckin,
        message: 'Checkin updated successfully'
      });
    } else {
      // Create new checkin
      const newCheckin: HabitCheckin = {
        id: `${habitId}-${date}`,
        userId: 'demo-user', // Replace with actual user ID from auth
        habitId,
        date,
        status,
        effort: effort ?? 2, // Default effort
        doseActual,
        note,
        createdAt: new Date().toISOString()
      };

      checkins.push(newCheckin);

      return NextResponse.json({
        success: true,
        data: newCheckin,
        message: 'Checkin created successfully'
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error in checkin API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');
    const userId = searchParams.get('userId');

    let filteredCheckins = checkins;

    // Filter by habitId if provided
    if (habitId) {
      filteredCheckins = filteredCheckins.filter(c => c.habitId === habitId);
    }

    // Filter by date if provided
    if (date) {
      filteredCheckins = filteredCheckins.filter(c => c.date === date);
    }

    // Filter by userId if provided
    if (userId) {
      filteredCheckins = filteredCheckins.filter(c => c.userId === userId);
    }

    return NextResponse.json({
      success: true,
      data: filteredCheckins,
      count: filteredCheckins.length
    });
  } catch (error) {
    console.error('Error fetching checkins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, effort, doseActual, note } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const checkinIndex = checkins.findIndex(c => c.id === id);
    if (checkinIndex === -1) {
      return NextResponse.json(
        { error: 'Checkin not found' },
        { status: 404 }
      );
    }

    // Update checkin
    const updatedCheckin: HabitCheckin = {
      ...checkins[checkinIndex],
      ...(status && { status }),
      ...(effort !== undefined && { effort }),
      ...(doseActual !== undefined && { doseActual }),
      ...(note !== undefined && { note }),
      editedAt: new Date().toISOString()
    };

    checkins[checkinIndex] = updatedCheckin;

    return NextResponse.json({
      success: true,
      data: updatedCheckin,
      message: 'Checkin updated successfully'
    });
  } catch (error) {
    console.error('Error updating checkin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
