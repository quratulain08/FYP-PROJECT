import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/student';
import InternshipModel from '@/models/internship'; // Import the internship model

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
  const universityId = params.slug;

  try {
    if (!universityId) {
      return NextResponse.json(
        { error: "universityId is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');

    const filter: Record<string, any> = { university: universityId };
    if (department) filter.department = department;

    // Step 1: Get all assigned student IDs
    const internships = await InternshipModel.find({ universityId });
    const assignedStudentIds = internships
      .flatMap(i => i.assignedStudents.map(id => id.toString()));

    // Step 2: Filter students not in assignedStudentIds
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
