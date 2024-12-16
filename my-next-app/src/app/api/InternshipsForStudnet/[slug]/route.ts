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

    if (!studentId || !internshipId) {
      return NextResponse.json({ error: "Student ID and Internship ID are required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(internshipId)) {
      return NextResponse.json({ error: "Invalid Student ID or Internship ID format." }, { status: 400 });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      console.error(`Student not found with ID: ${studentId}`);
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const internship = await InternshipModel.findById(internshipId);
    if (!internship) {
      console.error(`Internship not found with ID: ${internshipId}`);
      return NextResponse.json({ error: "Internship not found." }, { status: 404 });
    }

    if (!Array.isArray(internship.assignedStudents)) {
      console.error("Internship's assignedStudents is not an array:", internship.assignedStudents);
      return NextResponse.json({ error: "Invalid internship data." }, { status: 500 });
    }

    if (!internship.assignedStudents.includes(studentId)) {
      internship.assignedStudents.push(studentId);

      try {
        await internship.save();
      } catch (saveError) {
        console.error("Error saving internship:", saveError);
        return NextResponse.json({ error: "Error saving internship data." }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Student assigned to internship successfully." }, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Validation error assigning student to internship:", error.errors);
    } else {
      console.error("Error assigning student to internship:", error.message);
      console.error(error.stack);
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
