import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path if necessary
import Student from '@/models/student'; // Adjust the path if necessary

// Helper to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// GET: Fetch all students with optional department and batch filters.
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const batch = searchParams.get('batch');

    const filter: Record<string, any> = {};
    if (department) filter.department = department;
    if (batch) filter.batch = batch;

    const students = await Student.find(filter);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to fetch students', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST: Add a new student to the database.
export async function POST(req: Request) {
  try {
    console.log("POST request received");

    const studentData = await req.json();
    console.log("Parsed student data:", studentData);

    // Check if the studentData object is properly structured
    if (!studentData || typeof studentData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid student data format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log("Connected to the database");

    const { name, department, batch, didInternship, registrationNumber ,section } = studentData;
    
    // Log each field
    console.log("Received student data fields:");
    console.log(`Name: ${name}, Department: ${department}, Batch: ${batch}, Internship Status: ${didInternship}, Registration Number: ${registrationNumber}`);

    // Validate the required fields
    if (!name || !department || !batch || didInternship === undefined || !registrationNumber  || !section) {
      console.log("Missing required fields");
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missingFields: { name, department, batch, didInternship, registrationNumber,section},
        },
        { status: 400 }
      );
    }

    const newStudent = new Student(studentData);
    console.log("Creating new student:", newStudent);

    await newStudent.save();
    console.log("Student added to the database");

    return NextResponse.json({ message: 'Student added successfully!' });
  } catch (error) {
    console.error("Error occurred while adding student:", error);

    return NextResponse.json(
      {
        error: 'Failed to add student',
        details: getErrorMessage(error),
        data: req.body, // Or replace with `studentData` if declared earlier
      },
      { status: 500 }
    );
  }
}


// PUT: Update a student’s details by ID.
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: 'Missing student ID' }, { status: 400 });
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully!' });
  } catch (error) {
    console.error('Error updating student:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to update student', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE: Remove a student by ID.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: 'Missing student ID' }, { status: 400 });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully!' });
  } catch (error) {
    console.error('Error deleting student:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to delete student', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
