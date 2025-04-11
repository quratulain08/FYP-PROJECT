import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as necessary
import Profile from '@/models/InstituteProfile'; // Adjust the path as necessary

// GET: Fetch all profiles from the database.
export async function GET(req: Request,
  { params }: { params: { slug: string } }
) {
  const universityId = params.slug;

  try {
    if (!universityId) {
      return NextResponse.json(
        { error: "universityId is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Assuming Profile has a `university` field that links to the university
    const profiles = await Profile.find({ university: universityId });

    if (profiles.length === 0) {
      return NextResponse.json(
        { error: "No profiles found for this university" },
        { status: 404 }
      );
    }

    return NextResponse.json(profiles);

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles', details: error.message },
      { status: 500 }
    );
  }
}
