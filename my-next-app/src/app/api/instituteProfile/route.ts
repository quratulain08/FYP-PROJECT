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

// POST: Create or update a profile in the database.
export async function POST(req: Request) {
  try {
    const profileData = await req.json();
    await connectToDatabase();

    const { role } = profileData; // Assuming role is provided in the body
    let profile = await Profile.findOne({ role });

    if (profile) {
      // Update the existing profile.
      Object.assign(profile, profileData);
    } else {
      // Create a new profile.
      profile = new Profile(profileData);
    }

    await profile.save();
    return NextResponse.json({ message: 'Profile saved successfully!' });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

// DELETE: Remove a profile from the database by role.
export async function DELETE(req: Request) {
  try {
    const { role } = await req.json();
    await connectToDatabase();

    await Profile.findOneAndDelete({ role });

    return NextResponse.json({ message: 'Profile deleted successfully!' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
