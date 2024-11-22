import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import InternshipModel from '@/models/internship';
import connectToDatabase from '@/lib/mongodb'; // Assuming you have a separate DB connection function

export async function DELETE(req: Request) {
  try {
    // Extracting the ID from the request URL
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    await connectToDatabase(); // Ensure DB connection

    // Try deleting the internship by its ID
    const deletedInternship = await InternshipModel.findByIdAndDelete(id);
    if (!deletedInternship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      );
    }

    // Return success message if internship deleted
    return NextResponse.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json(
      { error: 'Failed to delete internship' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params; // Get the slug from params
    console.log('Received slug:', slug);

    // Extract updated data from the request body
    const updatedData = await req.json();

    await connectToDatabase(); // Ensure DB connection

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(slug)) {
      return NextResponse.json(
        { message: `Invalid internship ID: ${slug}` },
        { status: 400 }
      );
    }

    // Update the internship by ID with new data
    const updatedInternship = await InternshipModel.findByIdAndUpdate(slug, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedInternship) {
      return NextResponse.json(
        { message: 'Internship not found' },
        { status: 404 }
      );
    }

    // Return the updated internship as JSON
    return NextResponse.json(updatedInternship);
  } catch (error) {
    console.error('Error updating internship:', error);
    return NextResponse.json(
      { error: 'Failed to update internship' },
      { status: 500 }
    );
  }
}
