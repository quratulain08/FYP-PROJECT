import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import InternshipModel from '@/models/internship'; // Adjust path if necessary

// GET: Fetch all internships.
export async function GET() {
  try {
    await connectToDatabase();
    const internships = await InternshipModel.find();
    return NextResponse.json(internships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}

// PUT: Approve or unapprove an internship by ID.
export async function PUT(req: Request) {
  try {
    const { id, isApproved } = await req.json(); // Extract ID and approval status from request body

    if (!id || typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'Internship ID and approval status are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const internship = await InternshipModel.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true } // Return updated document
    );

    if (!internship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Internship approval status updated', internship });
  } catch (error) {
    console.error('Error updating internship approval status:', error);
    return NextResponse.json(
      { error: 'Failed to update internship approval status' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an internship by ID.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Extract ID from request body

    if (!id) {
      return NextResponse.json(
        { error: 'Internship ID is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const internship = await InternshipModel.findByIdAndDelete(id);

    if (!internship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json(
      { error: 'Failed to delete internship' },
      { status: 500 }
    );
  }
}
