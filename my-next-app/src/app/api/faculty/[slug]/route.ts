import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import FacultyModel from '@/models/faculty';
import connectToDatabase from '@/lib/mongodb';

// Utility to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

// GET - Fetch a single faculty member by ID
export async function GET(
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
    const faculty = await FacultyModel.findById(facultyId);

    if (!faculty) {
      return NextResponse.json(
        { message: 'Faculty member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a faculty member by ID
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

    return NextResponse.json({ 
      message: 'Faculty member deleted successfully',
      deletedFaculty 
    });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Edit a faculty member by ID
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
    const requestBody = await request.json();

    const updatedFaculty = await FacultyModel.findByIdAndUpdate(
      facultyId,
      { $set: requestBody },
      { new: true, runValidators: true }
    );

    if (!updatedFaculty) {
      return NextResponse.json(
        { message: 'Faculty member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Faculty member updated successfully',
      updatedFaculty 
    });
  } catch (error) {
    console.error('Error updating faculty:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
