import { NextResponse } from 'next/server';
import { getStudentById, updateStudent } from '@/lib/google-sheets';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/students/[id] - Get single student
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const student = await getStudentById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch student'
      },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedStudent = await updateStudent(id, body);

    if (!updatedStudent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Student not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update student'
      },
      { status: 500 }
    );
  }
}