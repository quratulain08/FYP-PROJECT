import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '../../../../models/Department';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const universityId = params.slug;

  try {
    if (!universityId) {
      return NextResponse.json(
        { error: "universityId is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the universityId exists in the Department model
    const departments = await Department.find({ university: universityId });

    if (!departments || departments.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    return NextResponse.json(departments);
      ``
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments', details: error.message },
      { status: 500 }
    );
  }
}
