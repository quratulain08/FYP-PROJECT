import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Industry from '@/models/Industry';

export async function GET() {
  try {
    await connectToDatabase();
    const industries = await Industry.find({});
    console.log('GET: Retrieved Industries from DB:', industries);
    return NextResponse.json(industries);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    console.log("POST: Received Industry data:", body);

    const { name, contactEmail, location } = body;

    if (!name || !contactEmail || !location) {
      return NextResponse.json(
        { error: "Name, contact email, and location are required" },
        { status: 400 }
      );
    }

    const industry = new Industry({
      name,
      contactEmail,
      location,
    });

    const savedIndustry = await industry.save();
    console.log("POST: Saved industry to DB:", savedIndustry);

    return NextResponse.json(
      { industryId: savedIndustry._id, ...savedIndustry._doc },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create industry" },
      { status: 500 }
    );
  }
}
