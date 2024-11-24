import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Student from '@/models/student';

// GET: Fetch a single student by registration number
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
  ) {
    const email = params.slug;
  
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
  
    try {
      await connectToDatabase();
  
      const student = await Student.findOne({ email });
  
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
  
      return NextResponse.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
  }
// POST: Add a new student
export async function POST(req: Request) {
  try {
    const studentData = await req.json();
    await connectToDatabase();

    const newStudent = new Student(studentData);
    await newStudent.save();

    return NextResponse.json({ message: 'Student added successfully!', student: newStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
  }
}

// PUT: Update a student's information
export async function PUT(req: Request) {
  try {
    const { _id, ...studentData } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: 'Student ID is required for update' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedStudent = await Student.findByIdAndUpdate(_id, studentData, {
      new: true,
    });

    if (!updatedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully!', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE: Remove a student by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get('_id');

    if (!_id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const deletedStudent = await Student.findByIdAndDelete(_id);

    if (!deletedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully!' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
