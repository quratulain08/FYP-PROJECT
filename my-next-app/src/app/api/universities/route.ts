import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import University from '@/models/University';

export async function GET() {
  try {
    await connectToDatabase();
    const universities = await University.find({});
    console.log('GET: Retrieved universities from DB:', universities);
    return NextResponse.json(universities);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    console.log("POST: Received university data:", body);

    const { name, contactEmail, location } = body;

    if (!name || !contactEmail || !location) {
      return NextResponse.json(
        { error: "Name, contact email, and location are required" },
        { status: 400 }
      );
    }

    const university = new University({
      name,
      contactEmail,
      location,
    });

    const savedUniversity = await university.save();
    console.log("POST: Saved university to DB:", savedUniversity);

    return NextResponse.json(
      { universityId: savedUniversity._id, ...savedUniversity._doc }, // Ensuring ObjectId is included
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create university" },
      { status: 500 }
    );
  }
}