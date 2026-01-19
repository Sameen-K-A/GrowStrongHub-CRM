import { NextResponse } from 'next/server';
import { addLogToLead } from '@/lib/google-sheets';
import type { InteractionType } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/leads/[id]/logs - Add interaction log
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { type, note, next_followup } = body;

    if (!type || !note) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields (type, note)'
        },
        { status: 400 }
      );
    }

    const updatedLead = await addLogToLead(
      id,
      { type: type as InteractionType, note },
      next_followup
    );

    if (!updatedLead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error('Error adding log:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add interaction log'
      },
      { status: 500 }
    );
  }
}