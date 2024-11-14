import { NextResponse } from 'next/server';
import Department from '@/models/Department';
import connectToDatabase from '@/lib/mongodb';
import { Types } from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params; // Get the slug from params
    console.log("Received slug:", slug); // Debugging log

    // Check if slug is a valid ObjectId
    if (!Types.ObjectId.isValid(slug)) {
      return NextResponse.json(
        { message: `Invalid department ID: ${slug}` },
        { status: 400 }
      );
    }

    await connectToDatabase(); // Ensure DB connection

    const department = await Department.findById(slug); // Use slug to fetch by ID
    if (!department) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      );
    }

    // Return the department data
    return NextResponse.json(department);
  } catch (error) {
    console.error('Department fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params; // Get the slug from params
    console.log("Received slug:", slug); 

    // Extract updated data from the request body
    const updatedData = await request.json();

    await connectToDatabase(); // Connect to database

    if (!slug) {
      return NextResponse.json({ error: 'Missing department slug' }, { status: 400 });
    }

    // Update the department by slug with new data
    const updatedDepartment = await Department.findOneAndUpdate(
      { slug }, // Use slug to find the department
      updatedData, // Update with the new data
      {
        new: true, // Return the updated document
        runValidators: true, // Run model validators
      }
    );

    // If department not found, return a 404 response
    if (!updatedDepartment) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Return the updated department as JSON
    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    await connectToDatabase();

    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Department deleted successfully!' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}
