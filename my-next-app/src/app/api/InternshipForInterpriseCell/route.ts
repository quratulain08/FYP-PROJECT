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

// PUT: Approve or unapprove an internship and assign department by ID.
export async function PUT(req: Request) {
  try {
    const { id, isApproved, departmentId, rejectionComment } = await req.json();

    if (!id || typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'Internship ID and approval status are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateFields: { isApproved: boolean; assignedDepartment?: string; rejectionComment?: string } = { isApproved };

if (isApproved && departmentId) {
  updateFields.assignedDepartment = departmentId;
} else if (!isApproved && rejectionComment) {
  updateFields.rejectionComment = rejectionComment;
}

    const internship = await InternshipModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!internship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: isApproved ? 'Internship approval status and department updated' : 'Internship rejected with comment',
      internship,
    });
  } catch (error) {
    console.error('Error updating internship:', error);
    return NextResponse.json(
      { error: 'Failed to update internship' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an internship by ID.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

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
