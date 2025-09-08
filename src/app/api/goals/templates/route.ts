import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    // Build query
    let query = supabase
      .from('goal_templates')
      .select('*')
      .eq('is_active', true)
      .order('difficulty_level', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (difficulty) {
      query = query.eq('difficulty_level', parseInt(difficulty));
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error('Error fetching goal templates:', error);
      return NextResponse.json({ error: 'Failed to fetch goal templates' }, { status: 500 });
    }

    return NextResponse.json({ data: templates });

  } catch (error) {
    console.error('Goal templates API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, templateId, customizations = {} } = body;

    if (!userId || !templateId) {
      return NextResponse.json({ 
        error: 'User ID and template ID are required' 
      }, { status: 400 });
    }

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('goal_templates')
      .select('*')
      .eq('id', templateId)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Create goal from template
    const goalData = {
      user_id: userId,
      title: customizations.title || template.title,
      purpose: customizations.purpose || template.purpose,
      target_type: template.target_type,
      target_value: customizations.target_value || template.target_value,
      target_date: customizations.target_date || calculateTargetDate(template.suggested_duration_days),
      priority: customizations.priority || 0,
      metadata: {
        source: 'template',
        template_id: templateId,
        customizations: customizations
      }
    };

    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .insert(goalData)
      .select()
      .single();

    if (goalError) {
      console.error('Error creating goal from template:', goalError);
      return NextResponse.json({ error: 'Failed to create goal from template' }, { status: 500 });
    }

    // Create starter habits if specified in template
    if (template.starter_habits && Array.isArray(template.starter_habits)) {
      for (const habitTemplate of template.starter_habits) {
        try {
          const habitData = {
            user_id: userId,
            title: habitTemplate.title,
            purpose: `Supporting habit for ${goal.title}`,
            moment: habitTemplate.moment || 'morning',
            cadence: { type: 'daily' },
            dose: habitTemplate.duration ? { unit: 'minutes', target: habitTemplate.duration } : null,
            difficulty: template.difficulty_level,
            archived: false
          };

          const { data: habit, error: habitError } = await supabase
            .from('habits')
            .insert(habitData)
            .select()
            .single();

          if (!habitError && habit) {
            // Link habit to goal
            const { error: mappingError } = await supabase
              .from('goal_habits')
              .insert({
                goal_id: goal.id,
                habit_id: habit.id,
                weight: habitTemplate.weight || 1.0
              });

            if (mappingError) {
              console.error('Error linking habit to goal:', mappingError);
            }
          }
        } catch (habitError) {
          console.error('Error creating starter habit:', habitError);
        }
      }
    }

    // Create initial milestone
    if (goal.target_date) {
      const { error: milestoneError } = await supabase
        .from('goal_milestones')
        .insert({
          goal_id: goal.id,
          title: 'Target Completion',
          description: `Complete ${goal.title} by target date`,
          due_date: goal.target_date
        });

      if (milestoneError) {
        console.error('Error creating initial milestone:', milestoneError);
      }
    }

    return NextResponse.json({ data: goal });

  } catch (error) {
    console.error('Goal template creation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateTargetDate(durationDays: number): string {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + durationDays);
  return targetDate.toISOString().split('T')[0];
}
