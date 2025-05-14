import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/student';
import InternshipModel from '@/models/internship';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const depId = params.slug;

  try {
    if (!depId) {
      return NextResponse.json(
        { error: "Department ID is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const filter: Record<string, any> = {
      department: depId, // assuming this matches your Student model
    };

    // Step 1: Get all assigned student IDs
    const internships = await InternshipModel.find({ department: depId });

    const assignedStudentIds = internships
      .flatMap(i => i.assignedStudents.map(id => id.toString()));

    // Step 2: Exclude students already assigned
    if (assignedStudentIds.length > 0) {
      filter._id = { $nin: assignedStudentIds };
    }

    const students = await Student.find(filter);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to fetch students', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
