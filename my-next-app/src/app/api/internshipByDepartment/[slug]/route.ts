import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import InternshipModel from '@/models/internship'; // Adjust path if necessary

// GET: Fetch internships by departmentId (slug)
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params; 
    await connectToDatabase();

    if (!slug) {
      return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });
    }

    const internships = await InternshipModel.find({ assignedDepartment: slug });

    return NextResponse.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}