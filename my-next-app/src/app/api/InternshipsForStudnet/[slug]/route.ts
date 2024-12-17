import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import InternshipModel from '@/models/internship';
import connectToDatabase from '@/lib/mongodb'; // Assuming you have a separate DB connection function
import StudentModel from '@/models/student'; // Ensure correct import of Student model

// DELETE Function
export async function DELETE(req: Request) {
  try {
    // Extracting the ID from the request URL
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    await connectToDatabase(); // Ensure DB connection

    // Try deleting the internship by its ID
    const deletedInternship = await InternshipModel.findByIdAndDelete(id);
    if (!deletedInternship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }

    // Return success message if internship deleted
    return NextResponse.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json(
      { error: 'Failed to delete internship' },
      { status: 500 }
    );
  }
}

// PUT Function

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const studentId = params.slug;

  try {
    await connectToDatabase();

    const body = await req.json();
    const { internshipId } = body;

    // Validate required IDs
    if (!studentId || !internshipId) {
      return NextResponse.json({ error: "Student ID and Internship ID are required." }, { status: 400 });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(internshipId)) {
      return NextResponse.json({ error: "Invalid Student ID or Internship ID format." }, { status: 400 });
    }

    // Check if Student exists
    const studentExists = await StudentModel.exists({ _id: studentId });
    if (!studentExists) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Add studentId to internship's assignedStudents array
    const internship = await InternshipModel.findByIdAndUpdate(
      internshipId,
      { $addToSet: { assignedStudents: studentId } }, // Add to array only if not present
      { new: true } // Return updated document
    );

    if (!internship) {
      return NextResponse.json({ error: "Internship not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Student assigned to internship successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error assigning student to internship:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}