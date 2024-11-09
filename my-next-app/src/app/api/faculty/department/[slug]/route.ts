import { NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import FacultyModel from '@/models/faculty';
import connectToDatabase from '@/lib/mongodb';

// Utility to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

// GET - Fetch all faculty members for a department
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const departmentId = params.slug;

  if (!isValidObjectId(departmentId)) {
    return NextResponse.json(
      { message: `Invalid department ID: ${departmentId}` },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const facultyMembers = await FacultyModel.find({ departmentId });

    // if (!facultyMembers || facultyMembers.length === 0) {
    //   return NextResponse.json(
    //     { message: 'No faculty members found for this department' },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json(facultyMembers);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching faculty:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new faculty member
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const departmentId = params.slug;

  if (!isValidObjectId(departmentId)) {
    return NextResponse.json(
      { message: `Invalid department ID: ${departmentId}` },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json();

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
    const err = error as Error;
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation error', details: (err as any).errors },
        { status: 400 }
      );
    }
    console.error('Error creating faculty:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a faculty member
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const facultyId = params.slug;

  if (!isValidObjectId(facultyId)) {
    return NextResponse.json(
      { message: `Invalid faculty ID: ${facultyId}` },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json();

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
    const err = error as Error;
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation error', details: (err as any).errors },
        { status: 400 }
      );
    }
    console.error('Error updating faculty:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


// DELETE - Remove a faculty member
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const facultyId = params.slug;

  if (!isValidObjectId(facultyId)) {
    return NextResponse.json(
      { message: `Invalid faculty ID: ${facultyId}` },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
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
    const err = error as Error;
    console.error('Error deleting faculty:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

