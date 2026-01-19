import { NextResponse } from 'next/server';
import { getLeads, createLead } from '@/lib/google-sheets';
import type { LeadSource } from '@/types';

// GET /api/leads - List all leads
export async function GET() {
  try {
    const leads = await getLeads();

    return NextResponse.json({
      success: true,
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leads'
      },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create new lead
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { child_name, parent_name, child_age, phone, location, lead_source } = body;

    if (!child_name || !parent_name || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const newLead = await createLead({
      child_name,
      parent_name,
      child_age: parseInt(child_age, 10) || 0,
      phone,
      location: location || '',
      lead_source: (lead_source || 'Direct') as LeadSource,
    });

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create lead'
      },
      { status: 500 }
    );
  }
}