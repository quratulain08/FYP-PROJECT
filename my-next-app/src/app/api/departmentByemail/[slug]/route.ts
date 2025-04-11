import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '@/models/Department'; // Adjust the path if necessary

// GET: Fetch department by matching coordinator email
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const coordinatorEmail = params.slug;

  if (!coordinatorEmail) {
    return NextResponse.json({ error: 'Coordinator email is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Find the department by matching coordinator's email
    const department = await Department.findOne({ 'CoordinatorEmail': coordinatorEmail });

    if (!department) {
      return NextResponse.json({ error: 'Department not found for the given coordinator email' }, { status: 404 });
    }

    // Return the department details (or only department ID if that's what you want)
    return NextResponse.json({
      departmentId: department._id, // Returning departmentId
    });
  } catch (error) {
    console.error('Error fetching department by coordinator email:', error);
    return NextResponse.json({ error: 'Failed to fetch department' }, { status: 500 });
  }
}
