import { NextResponse } from 'next/server';
import { getLeadById, updateLead, deleteLead } from '@/lib/google-sheets';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/leads/[id] - Get single lead
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch lead'
      },
      { status: 500 }
    );
  }
}

// PUT /api/leads/[id] - Update lead
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedLead = await updateLead(id, body);

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
    console.error('Error updating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update lead'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete lead
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteLead(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete lead'
      },
      { status: 500 }
    );
  }
}