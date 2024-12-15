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
  try {
    const { slug } = params; // slug contains the Student
    const body = await req.json(); // Parse request body
    const { internshipId } = body; // Extract internshipId from the request body

    // Validate request data
    if (!slug || !internshipId) {
      return NextResponse.json({ error: "Student ID and Internship ID are required." }, { status: 400 });
    }

    await connectToDatabase(); // Ensure database is connected

    // Validate Faculty existence
    const Student = await StudentModel.findById(slug); // Fetch faculty by facultyId from slug
    if (!Student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Validate Internship existence
    const internship = await InternshipModel.findById(internshipId); // Fetch internship by internshipId
    if (!internship) {
      return NextResponse.json({ error: "Internship not found." }, { status: 404 });
    }

    // Add the Faculty to the Internship's assignedFaculty array if not already present
    if (!internship.assignedStudents.includes(slug)) {
      internship.assignedStudents.push(slug); // Use facultyId (slug) to assign faculty
      await internship.save(); // Save the updated internship
    }

    return NextResponse.json({ message: "Student assigned to internship successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error assigning Student to internship:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}