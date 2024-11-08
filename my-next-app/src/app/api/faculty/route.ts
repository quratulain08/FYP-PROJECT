// pages/api/faculty/route.ts

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as necessary
import Faculty from '@/models/faculty'; // Adjust the path as necessary

// GET: Fetch all faculty members from the database.
export async function GET() {
  try {
    await connectToDatabase();
    const facultyMembers = await Faculty.find(); // Fetch all faculty members
    return NextResponse.json(facultyMembers);
  } catch (error) {
    console.error('Error fetching faculty members:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty members' }, { status: 500 });
  }
}

// POST: Create a new faculty member in the database.
export async function POST(req: Request) {
  try {
    const facultyData = await req.json(); // Parse the request body
    await connectToDatabase(); // Ensure the database is connected

    const newFaculty = new Faculty(facultyData); // Create a new faculty instance
    await newFaculty.save(); // Save the faculty to the database

    return NextResponse.json(newFaculty, { status: 201 }); // Respond with the created faculty member
  } catch (error) {
    console.error('Error creating faculty member:', error);
    return NextResponse.json({ error: 'Failed to create faculty member1' }, { status: 500 });
  }
}

// DELETE: Remove a faculty member from the database by id.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Get the id from the request body
    await connectToDatabase(); // Ensure the database is connected

    const deletedFaculty = await Faculty.findByIdAndDelete(id); // Delete the faculty member by id

    if (!deletedFaculty) {
      return NextResponse.json({ error: 'Faculty member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Faculty member deleted successfully!' });
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    return NextResponse.json({ error: 'Failed to delete faculty member' }, { status: 500 });
  }
}
