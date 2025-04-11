import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const focalPersonEmail = params.slug; // Extract email from the slug parameter

  try {
    if (!focalPersonEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the department by matching focalPersonEmail
    const department = await Department.findOne({ focalPersonEmail });

    if (!department) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no match
    }

    return NextResponse.json({ departmentId: department._id });

  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department', details: error.message },
      { status: 500 }
    );
  }
}
