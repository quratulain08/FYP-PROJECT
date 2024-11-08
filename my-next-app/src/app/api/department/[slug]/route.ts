import { NextResponse } from 'next/server';
import Department from '@/models/Department';
import connectToDatabase from '@/lib/mongodb';
import { Types } from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params; // Get the slug from params
    console.log("Received slug:", slug); // Debugging log

    // Check if slug is a valid ObjectId
    if (!Types.ObjectId.isValid(slug)) {
      return NextResponse.json(
        { message: `Invalid department ID: ${slug}` },
        { status: 400 }
      );
    }

    await connectToDatabase(); // Ensure DB connection

    const department = await Department.findById(slug); // Use slug to fetch by ID
    if (!department) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Return the department data
    return NextResponse.json(department);
  } catch (error) {
    console.error('Department fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
