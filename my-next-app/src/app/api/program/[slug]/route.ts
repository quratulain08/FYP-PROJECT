import { NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import Program from '@/models/Program';
import connectToDatabase from '@/lib/mongodb';

// Utility to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

// GET: Fetch programs by departmentId
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
    // Fetch programs by departmentId
    const programs = await Program.find({ departmentId });

    if (!programs || programs.length === 0) {
      return NextResponse.json({ message: 'No programs found for this departmentId' }, { status: 404 });
    }

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new program
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Get the request body data
    const {
      name,
      departmentId,
      startDate,
      category,
      durationYears,
      description,
      contactEmail,
      contactPhone,
      programHead,
      programHeadContact,
      programObjectives,
    } = body;

    // Validation for required fields
    if (
      !name ||
      !departmentId ||
      !startDate ||
      !category ||
      !durationYears ||
      !contactEmail ||
      !programHead
    ) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }

    // Validate departmentId (MongoDB ObjectId)
    if (!isValidObjectId(departmentId)) {
      return NextResponse.json({ error: 'Invalid departmentId format' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if a program with the same name or slug already exists (optional)
    const existingProgram = await Program.findOne({ name });
    if (existingProgram) {
      return NextResponse.json({ message: 'Program with this name already exists' }, { status: 409 });
    }

    // Create a new Program instance
    const newProgram = new Program({
      name,
      departmentId,
      startDate,
      category,
      durationYears,
      description,
      contactEmail,
      contactPhone,
      programHead,
      programHeadContact,
      programObjectives,
    });

    // Save the new program to the database
    const savedProgram = await newProgram.save();

    return NextResponse.json(savedProgram, { status: 201 }); // Return the saved program with status 201
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a program by slug
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const updateData = await request.json();
    await connectToDatabase();

    const updatedProgram = await Program.findOneAndUpdate(
      { slug },
      updateData,
      { new: true }
    );

    if (!updatedProgram) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Program updated successfully!', program: updatedProgram });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a program by slug
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const deletedProgram = await Program.findOneAndDelete({ slug });

    if (!deletedProgram) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Program deleted successfully!' });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program', details: error.message },
      { status: 500 }
    );
  }
}
