import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import InternshipModel from '@/models/internship';

// Function to safely extract error messages
const getErrorMessage = (error: any) => error instanceof Error ? error.message : String(error);

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    await connectToDatabase();

    const universityId = params.slug; // Extract universityId from slug parameter

    if (!universityId) {
      return NextResponse.json({ error: "University ID is required." }, { status: 400 });
    }

    // Find internships for the given university
    const internships = await InternshipModel.find({ universityId: universityId });
    return NextResponse.json(internships);
  } catch (error) {
    console.error("Error fetching internships:", getErrorMessage(error));
    return NextResponse.json(
      { error: "Failed to fetch internships", details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
