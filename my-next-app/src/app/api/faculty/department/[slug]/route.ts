// app/api/faculty/department/[id]/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FacultyModel from '@/models/faculty';

// Connect to MongoDB (you should move this to a separate utility file)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

// GET - Fetch all faculty members for a department
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const departmentId = params.id;
    const facultyMembers = await FacultyModel.find({ departmentId });
    
    if (!facultyMembers || facultyMembers.length === 0) {
      return NextResponse.json(
        { message: 'No faculty members found for this department' },
        { status: 404 }
      );
    }

    return NextResponse.json(facultyMembers);
  } catch (error) {
    console.error('Faculty fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new faculty member
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const departmentId = params.id;

    // Validate CNIC uniqueness
    const existingFaculty = await FacultyModel.findOne({ cnic: body.cnic });
    if (existingFaculty) {
      return NextResponse.json(
        { message: 'Faculty member with this CNIC already exists' },
        { status: 409 }
      );
    }

    const newFaculty = new FacultyModel({
      ...body,
      departmentId,
    });

    const savedFaculty = await newFaculty.save();
    return NextResponse.json(savedFaculty, { status: 201 });
  } catch (error) {
    console.error('Faculty creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a faculty member
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const facultyId = params.id;

    // Check if CNIC is being updated and ensure it's unique
    if (body.cnic) {
      const existingFaculty = await FacultyModel.findOne({
        cnic: body.cnic,
        _id: { $ne: facultyId }
      });
      if (existingFaculty) {
        return NextResponse.json(
          { message: 'Faculty member with this CNIC already exists' },
          { status: 409 }
        );
      }
    }

    const updatedFaculty = await FacultyModel.findByIdAndUpdate(
      facultyId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedFaculty) {
      return NextResponse.json(
        { message: 'Faculty member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFaculty);
  } catch (error) {
    console.error('Faculty update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a faculty member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const facultyId = params.id;

    const deletedFaculty = await FacultyModel.findByIdAndDelete(facultyId);

    if (!deletedFaculty) {
      return NextResponse.json(
        { message: 'Faculty member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Faculty member deleted successfully' }
    );
  } catch (error) {
    console.error('Faculty deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}