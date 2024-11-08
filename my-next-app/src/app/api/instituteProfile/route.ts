import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as necessary
import Profile from '@/models/InstituteProfile'; // Adjust the path as necessary

// GET: Fetch all profiles from the database.
export async function GET() {
  try {
    await connectToDatabase();
    const profiles = await Profile.find();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
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
