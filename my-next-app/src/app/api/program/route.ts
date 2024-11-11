import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Program from '@/models/Program';
import { IProgram } from '@/models/Program';

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// GET: Fetch all programs with optional department filter.
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('departmentId');

    const filter: Record<string, any> = {};
    if (departmentId) filter.departmentId = departmentId;

    const programs = await Program.find(filter).populate("departmentId");
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to fetch programs', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST: Add a new program to the database.
export async function POST(req: Request) {
  try {
    const programData = await req.json();
    await connectToDatabase();

    const {
      name,
      departmentId,
      startDate,
      category,
      durationYears,
      contactEmail,
      programHead,
    } = programData;

    // Validate the required fields
    if (!name || !departmentId || !startDate || !category || !durationYears || !contactEmail || !programHead) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missingFields: { name, departmentId, startDate, category, durationYears, contactEmail, programHead },
        },
        { status: 400 }
      );
    }

    const newProgram = new Program(programData);
    await newProgram.save();

    return NextResponse.json({ message: 'Program added successfully!' });
  } catch (error) {
    console.error('Error adding program:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to add program', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT: Update a program’s details by ID.
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: 'Missing program ID' }, { status: 400 });
    }

    const updatedProgram = await Program.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Program updated successfully!' });
  } catch (error) {
    console.error('Error updating program:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to update program', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE: Remove a program by ID.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: 'Missing program ID' }, { status: 400 });
    }

    const deletedProgram = await Program.findByIdAndDelete(id);

    if (!deletedProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Program deleted successfully!' });
  } catch (error) {
    console.error('Error deleting program:', getErrorMessage(error));
    return NextResponse.json(
      { error: 'Failed to delete program', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
