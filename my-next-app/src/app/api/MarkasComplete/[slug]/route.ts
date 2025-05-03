import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import InternshipModel from '@/models/internship';
import Student from '@/models/student';

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const internshipId = params.slug;

  try {
    await connectToDatabase();

    if (!internshipId) {
      return NextResponse.json({ error: 'Internship ID is required' }, { status: 400 });
    }

    // Find the internship by ID
    const internship = await InternshipModel.findById(internshipId);
    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    // Mark internship as complete
    internship.isComplete = true;
    await internship.save();

    // Get all assigned student IDs
    const assignedStudentIds = internship.assignedStudents;

    if (assignedStudentIds && assignedStudentIds.length > 0) {
      // Update all assigned students' `didInternship` field to `true`
      await Student.updateMany(
        { _id: { $in: assignedStudentIds } },
        { $set: { didInternship: true } }
      );
    }

    return NextResponse.json({ message: 'Internship marked as complete and students updated successfully.' });
  } catch (error) {
    console.error('Error marking internship as complete:', error);
    return NextResponse.json(
      { error: 'Failed to mark internship as complete', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
