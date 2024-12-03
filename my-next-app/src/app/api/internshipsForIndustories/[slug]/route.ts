import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Ensure you have a connection function
import InternshipModel from '@/models/internship';
import StudentModel from '@/models/student';

// DELETE Function
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    await connectToDatabase();

    const deletedInternship = await InternshipModel.findByIdAndDelete(id);
    if (!deletedInternship) {
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

// PUT Function to Assign a Student to an Internship
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params; // Student ID
    const body = await req.json();
    const { internshipId } = body;

    if (!slug || !internshipId) {
      return NextResponse.json(
        { error: 'Student ID and Internship ID are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await StudentModel.findById(slug);
    if (!student) {
      return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
    }

    const internship = await InternshipModel.findById(internshipId);
    if (!internship) {
      return NextResponse.json({ error: 'Internship not found.' }, { status: 404 });
    }

    if (!internship.assignedStudents.includes(slug)) {
      internship.assignedStudents.push(slug);
      await internship.save();
    }

    return NextResponse.json(
      { message: 'Student assigned to internship successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error assigning student to internship:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET Function to Fetch Internships
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const universityId = url.searchParams.get('universityId');

    await connectToDatabase();

    const filter = universityId ? { universityId } : {};
    const internships = await InternshipModel.find(filter);

    return NextResponse.json({ internships });
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch internships' },
      { status: 500 }
    );
  }
}

// POST Function to Create an Internship
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectToDatabase();

    const newInternship = new InternshipModel(body);
    await newInternship.save();

    return NextResponse.json(
      { message: 'Internship created successfully.', internship: newInternship },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating internship:', error);
    return NextResponse.json(
      { error: 'Failed to create internship' },
      { status: 500 }
    );
  }
}
