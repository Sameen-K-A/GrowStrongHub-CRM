import { NextResponse } from 'next/server';
import { getStudents, createStudent } from '@/lib/google-sheets';

// GET /api/students - List all students
export async function GET() {
  try {
    const students = await getStudents();

    return NextResponse.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch students'
      },
      { status: 500 }
    );
  }
}

// POST /api/students - Create new student
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { child_name, parent_name, child_age, phone, location, joined_date } = body;

    if (!child_name || !parent_name || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const newStudent = await createStudent({
      child_name,
      parent_name,
      child_age: parseInt(child_age, 10) || 0,
      phone,
      location: location || '',
      joined_date: joined_date || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ success: true, data: newStudent }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create student'
      },
      { status: 500 }
    );
  }
}